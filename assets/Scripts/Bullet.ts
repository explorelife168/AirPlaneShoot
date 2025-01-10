import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Bullet")
export class Bullet extends Component {
  @property
  speed: number = 600;

  start() {}

  update(deltaTime: number) {
    const p = this.node.position;
    this.node.setPosition(p.x, p.y + this.speed * deltaTime, p.z);
    console.log(this.speed);
  }
}
