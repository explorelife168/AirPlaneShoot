import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

export enum RewardType {
  Bomb,
  TwoShoot,
}

@ccclass("Reward")
export class Reward extends Component {
  @property
  speed: number = 120;

  @property
  rewardType: RewardType = RewardType.TwoShoot;
  start() {}

  update(deltaTime: number) {
    const p = this.node.position;
    this.node.setPosition(p.x, p.y - this.speed * deltaTime, p.z);

    if (this.node.position.y < -580) {
      this.node.destroy();
    }
  }
}
