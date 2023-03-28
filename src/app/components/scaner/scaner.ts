import { HttpService } from '../../service/http.service';
import {
  Component, OnInit, Input, Output,
  EventEmitter, OnChanges, ViewChild, OnDestroy
} from '@angular/core';
import { ToastService } from 'ng-zorro-antd-mobile';
import adapter from 'webrtc-adapter';
import jsQR from 'jsqr';
@Component({
  selector: 'ph-scaner',
  templateUrl: './scaner.html',
  styleUrls: ['./scaner.less'],
})
export class Scaner implements OnInit, OnChanges, OnDestroy {
  @Output() scanData = new EventEmitter();
  // 使用后置相机
  @Input() useBackCamera = true;
  // 扫描识别后停止
  @Input() stopOnScaned = true;
  @Input() drawOnfound = true;
  // 线条颜色
  @Input() lineColor = '#03C03C';
  // 线条宽度
  @Input() lineWidth = 2;
  // 视频宽度
  @Input() videoWidth = 640;
  // 视频高度
  @Input() videoHeight = 640;
  @Input() responsive = false;

  showPlay = false;
  showBanner = true;
  containerWidth = null;
  active: any = false;
  previousCode = null;
  parity = 0;
  canvas: any;
  constructor(
    private http: HttpService,
    private _toast: ToastService
  ) { }
  canvasElement: any;
  canvasContext: any;
  // outputContainer: any;
  // outputMessage: any;
  // outputData: any;
  video: any;
  stop: any;
  async ngOnChanges() {

  }

  ngOnInit() {
    this.canvasElement = document.getElementById('scan-canvas');
    this.canvasContext = this.canvasElement.getContext('2d');
    // this.outputContainer = document.getElementById('output');
    // this.outputMessage = document.getElementById('outputMessage');
    // this.outputData = document.getElementById('outputData');

    this.video = document.createElement('video');

    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then(async (stream: MediaStream) => {
      this.video.srcObject = stream;
      this.video.setAttribute('playsinline', 'true'); // required to tell iOS safari we don't want fullscreen
      await this.video.play();
      this.stop = requestAnimationFrame(this.tick.bind(this));
    });
  }

  drawLine(begin, end, color): void {
    this.canvasContext.beginPath();
    this.canvasContext.moveTo(begin.x, begin.y);
    this.canvasContext.lineTo(end.x, end.y);
    this.canvasContext.lineWidth = 4;
    this.canvasContext.strokeStyle = color;
    this.canvasContext.stroke();
  }
  drawBox(location) {
    if (this.drawOnfound) {
      this.drawLine(location.topLeftCorner, location.topRightCorner, '#FF3B58');
      this.drawLine(location.topLeftCorner, location.topRightCorner, '#FF3B58');
      this.drawLine(location.topLeftCorner, location.topRightCorner, '#FF3B58');
      this.drawLine(location.topLeftCorner, location.topRightCorner, '#FF3B58');
    }
  }

  tick(): void {
    if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
      this.canvasElement.hidden = false;
      // this.outputContainer.hidden = false;

      this.canvasElement.height = this.video.videoHeight;
      this.canvasElement.width = this.video.videoWidth;
      this.canvasContext.drawImage(this.video, 0, 0, this.canvasElement.width, this.canvasElement.height);
      const imageData: ImageData = this.canvasContext.getImageData(0, 0, this.canvasElement.width, this.canvasElement.height);
      // this.canvas.drawImage(this.$refs.video, 0, 0, this.$refs.canvas.width, this.$refs.canvas.height);
      // const imageData = this.canvas.getImageData(0, 0, this.$refs.canvas.width, this.$refs.canvas.height);

      let code: any;
      try {
        code = jsQR(imageData.data, imageData.width, imageData.height);
        console.log(code);
      } catch (e) {
        console.error(e);
      }
      if (code) {
        this.drawBox(code.location);
        this.fullStop();
        this.scanData.emit(code);
        // this.drawLine(code.location.topLeftCorner, code.location.topRightCorner, '#FF3B58');
        // this.drawLine(code.location.topRightCorner, code.location.bottomRightCorner, '#FF3B58');
        // this.drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, '#FF3B58');
        // this.drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, '#FF3B58');
        // this.outputMessage.hidden = true;
        // this.outputData.parentElement.hidden = false;
      } else {
        // this.outputMessage.hidden = false;
        // this.outputData.parentElement.hidden = true;
      }
      this.stop = requestAnimationFrame(this.tick.bind(this));
    }
  }

  run() {
    if (this.active) {
      this.stop = requestAnimationFrame(this.tick.bind(this));
    }
  }
  // 完全停止
  fullStop() {
    if (this.video && this.video.srcObject) {
      this.video.srcObject.getTracks().forEach(t => t.stop());
    }
    cancelAnimationFrame(this.stop);
  }

  ngOnDestroy(): void {
    this.fullStop();
  }
}
