import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as THREE from 'three';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-form.html',
  styleUrls: ['./login-form.css']
})
export class LoginFormComponent implements AfterViewInit, OnDestroy {

  @ViewChild('loginCard') loginCard!: ElementRef;

  passwordVisible = false;
  username = '';
  password = '';

  private cssRenderer!: CSS3DRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private animationId!: number;

  ngAfterViewInit(): void {
    this.initCSS3D();

    window.addEventListener('resize', () => this.onResize());
  }

  private initCSS3D(): void {
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Escena y cámara
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 2000);
    this.camera.position.set(0, 0, 500);

    // CSS3DRenderer — renderiza HTML como objeto 3D
    this.cssRenderer = new CSS3DRenderer();
    this.cssRenderer.setSize(w, h);
    this.cssRenderer.domElement.style.position = 'fixed';
    this.cssRenderer.domElement.style.top = '0';
    this.cssRenderer.domElement.style.left = '0';
    this.cssRenderer.domElement.style.zIndex = '10';
    document.body.appendChild(this.cssRenderer.domElement);

    // Convierte el div del card en un objeto 3D
    const cardObject = new CSS3DObject(this.loginCard.nativeElement);
    cardObject.position.set(0, 0, 0);
    this.scene.add(cardObject);

    this.animate();
  }

  private animate(): void {
    this.animationId = requestAnimationFrame(() => this.animate());
    this.cssRenderer.render(this.scene, this.camera);
  }

  private onResize(): void {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.cssRenderer.setSize(w, h);
  }

  togglePassword(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  onLogin(): void {
    console.log('Usuario:', this.username);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
    document.body.removeChild(this.cssRenderer.domElement);
  }
}