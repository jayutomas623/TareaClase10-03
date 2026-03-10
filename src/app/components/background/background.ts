import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-background',
  standalone: true,
  templateUrl: './background.html',
  styleUrls: ['./background.css']
})
export class BackgroundComponent implements AfterViewInit, OnDestroy {

  @ViewChild('canvasContainer') canvasContainer!: ElementRef;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private animationId!: number;

  private isDragging = false;
  private prevMouse = { x: 0, y: 0 };
  private sphericalTarget = { phi: Math.PI / 2, theta: 0 };
  private sphericalCurrent = { phi: Math.PI / 2, theta: 0 };

  ngAfterViewInit(): void {
    this.initThree();
    this.addEventListeners();
  }

  private initThree(): void {
    const w = window.innerWidth;
    const h = window.innerHeight;

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.canvasContainer.nativeElement.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    this.camera.position.set(0, 0, 0.001);

    const loader = new THREE.TextureLoader();
    const texture = loader.load('assets/panorama.jpg');
    texture.mapping = THREE.EquirectangularReflectionMapping;
    const geometry = new THREE.SphereGeometry(500, 64, 40);
    geometry.scale(-1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    this.scene.add(new THREE.Mesh(geometry, material));

    this.animate();
  }

  private animate(): void {
    this.animationId = requestAnimationFrame(() => this.animate());

    if (!this.isDragging) {
      this.sphericalTarget.theta += 0.0005;
    }

    this.sphericalCurrent.theta += (this.sphericalTarget.theta - this.sphericalCurrent.theta) * 0.06;
    this.sphericalCurrent.phi   += (this.sphericalTarget.phi   - this.sphericalCurrent.phi)   * 0.06;

    const x = Math.sin(this.sphericalCurrent.phi) * Math.cos(this.sphericalCurrent.theta);
    const y = Math.cos(this.sphericalCurrent.phi);
    const z = Math.sin(this.sphericalCurrent.phi) * Math.sin(this.sphericalCurrent.theta);
    this.camera.lookAt(x, y, z);

    this.renderer.render(this.scene, this.camera);
  }

  private addEventListeners(): void {
    const el = this.renderer.domElement;

    el.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.prevMouse = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const dx = (e.clientX - this.prevMouse.x) * 0.003;
      const dy = (e.clientY - this.prevMouse.y) * 0.003;
      this.sphericalTarget.theta -= dx;
      this.sphericalTarget.phi = Math.max(0.3, Math.min(Math.PI - 0.3, this.sphericalTarget.phi - dy));
      this.prevMouse = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    window.addEventListener('resize', () => {
      const w = window.innerWidth, h = window.innerHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
    this.renderer.dispose();
  }
}