import { Player } from "./Player";
import { _decorator, AudioClip, Component, director, Game, Node } from "cc";
import { ScoreUI } from "./UI/ScoreUI";
import { BombUI } from "./UI/BombUI";
import { GameOverUI } from "./UI/GameOverUI";
import { AudioMgr } from "./AudioMgr";

const { ccclass, property } = _decorator;

@ccclass("GameManager")
export class GameManager extends Component {
  private static instance: GameManager;

  public static getInstance(): GameManager {
    return this.instance;
  }
  @property
  private bombNumber: number = 0;
  @property(BombUI)
  bombUI: BombUI = null;

  @property
  private score: number = 0;
  @property(ScoreUI)
  scoreUI: ScoreUI = null;

  @property(Node)
  pauseButtonNode: Node = null;

  @property(Node)
  resumeButtonNode: Node = null;

  @property(GameOverUI)
  GameOverUI: GameOverUI = null;

  @property(AudioClip)
  gameMusic: AudioClip = null;
  protected onLoad(): void {
    GameManager.instance = this;
  }

  protected start(): void {
    AudioMgr.inst.play(this.gameMusic, 0.05);
  }
  public addBomb() {
    this.bombNumber += 1;
    this.node.emit("onBombChange");
  }

  public GetBombNumber(): number {
    return this.bombNumber;
  }

  public addScore(s: number) {
    this.score += s;
    this.scoreUI.updateUI(this.score);
  }

  onPauseButtonClick() {
    director.pause();
    console.log(director.isPaused());
    this.pauseButtonNode.active = false;
    this.resumeButtonNode.active = true;
  }
  onResumeButtonClick() {
    director.resume();
    console.log(director.isPaused());
    this.pauseButtonNode.active = true;
    this.resumeButtonNode.active = false;
  }

  gameOver() {
    this.onResumeButtonClick();

    let highestScore = localStorage.getItem("HighestScore");
    let highestScoreInt = 0;
    if (highestScore !== null) {
      highestScoreInt = parseInt(highestScore, 10);
    }

    if (this.score > highestScoreInt) {
      localStorage.setItem("HighestScore", this.score.toString());
    }
    this.GameOverUI.showGameOverUI(this.score, highestScoreInt);
  }

  onRestartButtonClick() {
    this.onResumeButtonClick();
    director.loadScene(director.getScene().name);
  }
  isHaveBomb(): boolean {
    return this.bombNumber > 0;
  }
  useBomb() {
    if (this.bombNumber <= 0) return;
    this.bombNumber -= 1;
    this.node.emit("onBombChange");
  }
}
