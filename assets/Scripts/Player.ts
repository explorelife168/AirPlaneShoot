import { Bullet } from "./Bullet";
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
} from "cc";
const { ccclass, property } = _decorator;

enum ShootType {
  OneShoot,
  TwoShoot,
}
@ccclass("Player")
export class Player extends Component {
  @property
  shotRate: number = 0.5;

  shootTimer: number = 0;

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

  screenSize: Size = new Size();

  @property({ type: ShootType })
  shootType: ShootType = ShootType.OneShoot;

  protected onLoad(): void {
    input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.screenSize = view.getVisibleSize();
  }

  protected destroyed(): void {
    input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
  }
  onTouchMove(event: EventTouch) {
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

  protected update(dt: number): void {
    switch (this.shootType) {
      case ShootType.OneShoot:
        this.oneShoot(dt);
        break;
      case ShootType.TwoShoot:
        this.twoShoot(dt);
        break;
    }
  }
}
