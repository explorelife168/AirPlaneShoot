import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Background")
export class Background extends Component {
  @property(Node)
  Background01: Node = null;
  @property(Node)
  Background02: Node = null;

  @property
  speed: number = 100;

  start() {}

  update(deltaTime: number) {
    // 更新Background01 背景位置
    let position01 = this.Background01.position;
    this.Background01.setPosition(
      position01.x,
      position01.y - this.speed * deltaTime,
      position01.z
    );
    //更新Background02 背景位置
    let position02 = this.Background02.position;
    this.Background02.setPosition(
      position02.x,
      position02.y - this.speed * deltaTime,
      position02.z
    );

    if (position01.y < -852) {
      this.Background01.setPosition(
        position02.x,
        position02.y + 852,
        position02.z
      );
    }
    if (position02.y < -852) {
      this.Background02.setPosition(
        position01.x,
        position01.y + 852,
        position01.z
      );
    }
  }
}
