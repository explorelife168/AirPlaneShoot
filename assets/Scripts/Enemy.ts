import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Enemy")
export class Enemy extends Component {
  speed: number = 300;

  start() {}

  update(deltaTime: number) {
    const p = this.node.position;
    this.node.setPosition(p.x, p.y - this.speed * deltaTime, p.z);
  }
}
