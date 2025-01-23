import { _decorator, Component, LabelComponent, Node } from "cc";
import { GameManager } from "../GameManager";
const { ccclass, property } = _decorator;

@ccclass("BombUI")
export class BombUI extends Component {
  @property(LabelComponent)
  numberLabel: LabelComponent = null;

  start() {
    GameManager.getInstance().node.on("onBombChange", () =>
      this.onBombChange()
    );
  }

  onBombChange() {
    this.numberLabel.string = GameManager.getInstance()
      .GetBombNumber()
      .toString();
  }
}
