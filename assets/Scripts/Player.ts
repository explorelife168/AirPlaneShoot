import { LifeCountUI } from "./UI/LifeCountUI";
import {
  _decorator,
  Component,
  Node,
  input,
  Input,
  EventTouch,
  view,
  Size,
  Prefab,
  instantiate,
  CCFloat,
  Collider2D,
  Contact2DType,
  IPhysics2DContact,
  Animation,
  CCString,
  Sprite,
  director,
} from "cc";
import { Reward, RewardType } from "./Reward";
import { GameManager } from "./GameManager";

const { ccclass, property } = _decorator;

export enum ShootType {
  None,
  OneShoot,
  TwoShoot,
}
@ccclass("Player")
export class Player extends Component {
  @property({ type: CCFloat })
  shootType: ShootType = ShootType.OneShoot;

  get shotRate(): number {
    return this.shootType === ShootType.OneShoot ? 0.4 : 0.2;
  }

  shootTimer: number = 0;

  // 玩家血量
  @property
  lifeCount: number = 4;
  @property(Animation)
  anim: Animation = null;
  @property(CCString)
  animHit: string = "";
  @property(CCString)
  animDown: string = "";

  @property(LifeCountUI)
  lifeCountUI: LifeCountUI = null;

  // 雙發設定
  @property
  twoShootTime: number = 5;
  twoShootTimer: number = 0;

  //玩家碰撞 處理
  @property
  invincibleTime: number = 1;
  isInvincible: boolean = false;
  invincibleTimer: number = 0;

  @property(Node)
  bulletParent: Node = null;

  @property(Prefab)
  bullet01Prefab: Prefab = null;
  @property(Node)
  position01: Node = null;

  @property(Prefab)
  bullet02Prefab: Prefab = null;
  @property(Node)
  position02: Node = null;
  @property(Node)
  position03: Node = null;

  // private isControl: boolean = true;

  screenSize: Size = new Size();

  protected onLoad(): void {
    input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.screenSize = view.getVisibleSize();

    // 碰撞生成
    let collider = this.getComponent(Collider2D);
    if (collider) {
      collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }
  }

  protected destroyed(): void {
    input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);

    // 玩家碰撞飛機
    let collider = this.getComponent(Collider2D);
    if (collider) {
      collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }
  }
  protected start(): void {
    this.lifeCountUI.updateUI(this.lifeCount);
  }
  // 碰撞效果處理
  onBeginContact(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact | null
  ) {
    const reward = otherCollider.getComponent(Reward);
    if (reward) {
      this.onContactToReward(reward);
    } else {
      this.onContactToEnemy();
    }
  }

  transitionToOneShoot() {
    this.shootType = ShootType.OneShoot;
  }

  transitionToTwoShoot() {
    this.shootType = ShootType.TwoShoot;
    this.twoShootTimer = 0;
  }

  transitionToBomb() {}

  lastReward: Reward = null;
  onContactToReward(reward: Reward) {
    if (reward == this.lastReward) return;
    this.lastReward = reward;

    switch (reward.rewardType) {
      case RewardType.TwoShoot:
        this.transitionToTwoShoot();
        break;
      case RewardType.Bomb:
        GameManager.getInstance().addBomb();
        break;
    }
    reward.getComponent(Collider2D).enabled = false;
    reward.getComponent(Sprite).enabled = false;
  }

  // 敵機碰撞
  onContactToEnemy() {
    if (this.isInvincible) return;
    this.isInvincible = true;

    this.changeLifeCount(-1);
    let collider = this.getComponent(Collider2D);

    if (this.lifeCount > 0) {
      this.anim.play(this.animHit);
    } else {
      this.anim.play(this.animDown);
    }

    if (this.lifeCount <= 0) {
      this.shootType = ShootType.None;
      if (collider) {
        collider.enabled = false;
      }
      this.scheduleOnce(() => {
        GameManager.getInstance().gameOver();
      }, 1);
    }
  }

  changeLifeCount(count: number) {
    this.lifeCount += count;
    this.lifeCountUI.updateUI(this.lifeCount);
  }

  onTouchMove(event: EventTouch) {
    if (director.isPaused()) return;
    if (this.lifeCount < 1) return;
    const p = this.node.position;
    this.node.setPosition(
      p.x + event.getDeltaX(),
      p.y + event.getDeltaY(),
      p.z
    );
    //
    if (p.x > this.screenSize.width / 2) {
      this.node.setPosition(this.screenSize.width / 2 - 2, p.y, p.z);
    } else if (p.x < -this.screenSize.width / 2) {
      this.node.setPosition(-this.screenSize.width / 2 + 2, p.y, p.z);
    }

    if (p.y > this.screenSize.height / 2) {
      this.node.setPosition(p.x, this.screenSize.height / 2 - 60, p.z);
    } else if (p.y < -this.screenSize.height / 2) {
      this.node.setPosition(p.x, -this.screenSize.height / 2 + 60, p.z);
    }
  }

  oneShoot(dt: number) {
    this.shootTimer += dt;
    if (this.shootTimer >= this.shotRate) {
      this.shootTimer = 0;
      const bullet01 = instantiate(this.bullet01Prefab);
      this.bulletParent.addChild(bullet01);
      bullet01.setWorldPosition(this.position01.worldPosition);
    }
  }

  twoShoot(dt: number) {
    this.twoShootTimer += dt;
    if (this.twoShootTimer > this.twoShootTime) {
      this.transitionToOneShoot();
    }

    this.shootTimer += dt;
    if (this.shootTimer >= this.shotRate) {
      this.shootTimer = 0;
      const bullet01 = instantiate(this.bullet02Prefab);
      const bullet02 = instantiate(this.bullet02Prefab);
      this.bulletParent.addChild(bullet01);
      this.bulletParent.addChild(bullet02);
      bullet01.setWorldPosition(this.position02.worldPosition);
      bullet02.setWorldPosition(this.position03.worldPosition);
    }
  }
  // disableControl() {
  //   this.isControl = false;
  // }
  // enableControl() {
  //   this.isControl = true;
  // }

  protected update(dt: number): void {
    switch (this.shootType) {
      case ShootType.OneShoot:
        this.oneShoot(dt);
        break;
      case ShootType.TwoShoot:
        this.twoShoot(dt);
        break;
    }

    if (this.isInvincible) {
      this.invincibleTimer += dt;
      console.log(this.invincibleTime);
      if (this.invincibleTimer > this.invincibleTime) {
        this.isInvincible = false;
        this.invincibleTimer = 0;
        console.log("this.invincibleTimer > this.invincibleTime");
      }
    }
  }
}
