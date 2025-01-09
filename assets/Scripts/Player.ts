import {
  _decorator,
  Component,
  Node,
  input,
  Input,
  EventTouch,
  view,
  Size,
} from "cc";
const { ccclass, property } = _decorator;
@ccclass("Player")
export class Player extends Component {
  screenSize: Size = new Size();
  protected onLoad(): void {
    input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    this.screenSize = view.getVisibleSize();
    console.log(
      `Screen size: width = ${this.screenSize.width}, height = ${this.screenSize.height}`
    );
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
    console.log(p.y);
  }
}
