import {
  _decorator,
  Component,
  instantiate,
  Node,
  Prefab,
  view,
  Size,
  random,
  Input,
  input,
} from "cc";
import { GameManager } from "./GameManager";
import { Enemy } from "./Enemy";

const { ccclass, property } = _decorator;

@ccclass("EnemyManager")
export class EnemyManager extends Component {
  private static instance: EnemyManager = null;

  public static getInstance(): EnemyManager {
    return this.instance;
  }

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

  @property
  rewardSpawnRate: number = 3;
  @property(Prefab)
  reward1Prefab: Prefab = null;
  @property(Prefab)
  reward2Prefab: Prefab = null;

  enemyArray: Node[] = [];

  //雙擊點擊
  doubleClickInterval: number = 0.2;
  lastClickTime: number = 0;
  screenSize: Size = new Size();
  protected onLoad(): void {
    this.screenSize = view.getVisibleSize();

    input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
  }

  protected onDestroy(): void {
    input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
  }
  start() {
    EnemyManager.instance = this;
    this.schedule(this.enemy0Spawn, this.enemy0SpawnRate);
    this.schedule(this.enemy1Spawn, this.enemy1SpawnRate);
    this.schedule(this.enemy2Spawn, this.enemy2SpawnRate);
    this.schedule(this.rewardSpawn, this.rewardSpawnRate);
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

    const enemyNode = enemy0;
    this.enemyArray.push(enemyNode);
  }

  enemy1Spawn() {
    const enemy1 = instantiate(this.enemy1prefab);
    this.node.addChild(enemy1);
    const innerScreenSize = this.screenSize.width / 2;
    const randomX = Math.floor(
      Math.random() * innerScreenSize - Math.random() * innerScreenSize
    );
    enemy1.setPosition(randomX, this.screenSize.height * 0.7, 0);

    const enemyNode = enemy1;
    this.enemyArray.push(enemyNode);
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

    const enemyNode = enemy2;
    this.enemyArray.push(enemyNode);
  }

  rewardSpawn() {
    const randomNumber = Math.floor(Math.random() * 2);
    let prefab = null;

    randomNumber === 0
      ? (prefab = this.reward1Prefab)
      : (prefab = this.reward2Prefab);

    const reward = instantiate(prefab);
    this.node.addChild(reward);

    const innerScreenSize = this.screenSize.width / 2 - 25;
    const randomX = Math.floor(
      Math.random() * innerScreenSize - Math.random() * innerScreenSize
    );

    reward.setPosition(randomX, this.screenSize.height * 0.7, 0);
  }

  onTouchEnd(event) {
    let currentTime = Date.now();
    let timeDiff = (currentTime - this.lastClickTime) / 1000;

    if (timeDiff < this.doubleClickInterval) {
      console.log("detected a double click");
      this.onDoubleClick(event);
    }
    this.lastClickTime = currentTime;
  }

  onDoubleClick(event) {
    console.log("Double click action executed");
    if (!GameManager.getInstance().isHaveBomb()) return;
    GameManager.getInstance().useBomb();
    for (let e of this.enemyArray) {
      const enemy = e.getComponent(Enemy);
      enemy.killNow();
    }
  }

  removeEnemy(n: Node) {
    const index = this.enemyArray.indexOf(n);
    if (index !== -1) {
      this.enemyArray.splice(index, 1);
    }
  }
}
