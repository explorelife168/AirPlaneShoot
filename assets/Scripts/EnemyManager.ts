import { Enemy } from "./Enemy";
import {
  _decorator,
  Component,
  instantiate,
  Node,
  Prefab,
  view,
  Size,
  random,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("EnemyManager")
export class EnemyManager extends Component {
  @property
  enemy0SpawnRate: number = 1;
  @property(Prefab)
  enemy0Prefab: Prefab = null;

  @property
  enemy1SpawnRate: number = 0.5;
  @property(Prefab)
  enemy1prefab: Prefab = null;

  @property
  enemy2SpawnRate: number = 10;
  @property(Prefab)
  enemy2Prefab: Prefab = null;

  screenSize: Size = new Size();
  protected onLoad(): void {
    this.screenSize = view.getVisibleSize();
  }

  start() {
    this.schedule(this.enemy0Spawn, this.enemy0SpawnRate);
    this.schedule(this.enemy1Spawn, this.enemy1SpawnRate);
    this.schedule(this.enemy2Spawn, this.enemy2SpawnRate);
  }

  update(deltaTime: number) {}

  enemy0Spawn() {
    const enemy0 = instantiate(this.enemy0Prefab);
    this.node.addChild(enemy0);
    const innerScreenSize = this.screenSize.width / 2 - 25;
    const randomX = Math.floor(
      Math.random() * innerScreenSize - Math.random() * innerScreenSize
    );
    enemy0.setPosition(randomX, this.screenSize.height * 0.7, 0);
  }

  enemy1Spawn() {
    const enemy1 = instantiate(this.enemy1prefab);
    this.node.addChild(enemy1);
    const innerScreenSize = this.screenSize.width / 2;
    const randomX = Math.floor(
      Math.random() * innerScreenSize - Math.random() * innerScreenSize
    );
    enemy1.setPosition(randomX, this.screenSize.height * 0.7, 0);
  }

  enemy2Spawn() {
    const enemy2 = instantiate(this.enemy2Prefab);
    this.node.addChild(enemy2);
    const innerScreenSize =
      this.screenSize.width > 0
        ? this.screenSize.width / 2 - 40
        : this.screenSize.width / 2 + 40;
    const randomX = Math.floor(
      Math.random() * innerScreenSize - Math.random() * innerScreenSize
    );

    enemy2.setPosition(randomX, this.screenSize.height * 0.7, 0);
    console.log(this.screenSize.height);
  }
}
