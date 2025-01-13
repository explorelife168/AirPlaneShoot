import { _decorator, Component, Node, view, Size } from "cc";
import { ShootType } from "./Player";
const { ccclass, property } = _decorator;

@ccclass("Bullet")
export class Bullet extends Component {
  @property({ type: ShootType })
  shootType: ShootType = ShootType.OneShoot;
  get speed(): number {
    return this.shootType === ShootType.OneShoot ? 600 : 900;
  }

  screenSize: Size = new Size();
  protected onLoad(): void {
    this.screenSize = view.getVisibleSize();
  }

  start() {}

  update(deltaTime: number) {
    const p = this.node.position;
    this.node.setPosition(p.x, p.y + this.speed * deltaTime, p.z);
    if (p.y > this.screenSize.height) {
      console.log(p.y);
      this.node.destroy();
    }
  }
}
