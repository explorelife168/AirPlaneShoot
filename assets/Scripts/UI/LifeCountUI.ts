import { _decorator, Component, LabelComponent, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("LifeCountUI")
export class LifeCountUI extends Component {
  @property(LabelComponent)
  numberLabel: LabelComponent = null;
  updateUI(count: number) {
    this.numberLabel.string = count.toString();
  }
}
