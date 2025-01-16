import {
  _decorator,
  Animation,
  CCString,
  Collider2D,
  Component,
  Contact2DType,
  IPhysics2DContact,
  Node,
} from "cc";
const { ccclass, property } = _decorator;

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
    // otherCollider.enabled = false;
    this.hp -= 1;
    let collider = this.getComponent(Collider2D);
    if (this.hp > 0) {
      this.anim.play(this.animHit);
    } else {
      this.anim.play(this.animDown);
    }

    if (this.hp <= 0) {
      if (collider) {
        collider.enabled = false;
      }

      this.scheduleOnce(() => {
        this.node.destroy();
      }, 1);
    }
  }
  protected onDestroy(): void {
    let collider = this.getComponent(Collider2D);
    if (collider) {
      collider.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    }
  }
}
