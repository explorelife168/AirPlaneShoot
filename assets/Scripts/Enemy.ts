import { Player } from "./Player";
import {
  _decorator,
  Animation,
  CCString,
  Collider2D,
  Component,
  Contact2DType,
  IPhysics2DContact,
  Node,
  Sprite,
} from "cc";
const { ccclass, property } = _decorator;
import { Bullet } from "./Bullet";
import { GameManager } from "./GameManager";
import { EnemyManager } from "./EnemyManager";

@ccclass("Enemy")
export class Enemy extends Component {
  @property
  speed: number = 300;
  @property
  hp: number = 1;

  @property(Animation)
  anim: Animation = null;

  @property(CCString)
  animHit: string = "";
  @property(CCString)
  animDown: string = "";

  @property
  score: number = 100;

  // collider: Collider2D = null;

  start() {
    let collider = this.getComponent(Collider2D);
    if (collider) {
      collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }
  }

  update(deltaTime: number) {
    if (this.hp > 0) {
      const p = this.node.position;
      this.node.setPosition(p.x, p.y - this.speed * deltaTime, p.z);
    }
    if (this.node.position.y < -580) {
      this.node.destroy();
    }
  }

  onBeginContact(
    selfCollider: Collider2D,
    otherCollider: Collider2D,
    contact: IPhysics2DContact | null
  ) {
    const bullet = otherCollider.getComponent(Bullet);
    if (bullet) {
      const bulletSprite = otherCollider.getComponent(Sprite);
      if (bulletSprite) {
        bulletSprite.enabled = false; // 隱藏子彈的 Sprite
      }
      otherCollider.enabled = false; // 停用子彈的 Collider

      // 延遲銷毀子彈節點，避免破壞碰撞邏輯
      this.scheduleOnce(() => {
        otherCollider.node.destroy();
      }, 0);
    }

    this.hp -= 1;
    if (this.hp > 0) {
      this.anim.play(this.animHit);
    } else {
      this.anim.play(this.animDown);
    }

    if (this.hp <= 0) {
      this.dead();
    }
  }

  protected onDestroy(): void {
    let collider = this.getComponent(Collider2D);
    if (collider) {
      collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }
    EnemyManager.getInstance().removeEnemy(this.node);
  }

  isDead: boolean = false;
  dead() {
    if (this.isDead) return;

    GameManager.getInstance().addScore(this.score);
    const collider = this.getComponent(Collider2D);
    if (collider) {
      collider.enabled = false;
    }
    this.scheduleOnce(() => {
      this.node.destroy();
    }, 1);
    this.isDead = true;
  }

  killNow() {
    if (this.hp <= 0) return;
    this.anim.play(this.animDown);
    this.dead();
  }
}
