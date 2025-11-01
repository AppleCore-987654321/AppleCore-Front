import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleriaModule } from 'primeng/galleria';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [CommonModule, GalleriaModule],
  templateUrl: './hero-banner.component.html',
  styleUrls: ['./hero-banner.component.css']
})
export class HeroBannerComponent implements OnInit {
  images: any[] | undefined;

  ngOnInit() {
    this.images = [
      {
        itemImageSrc: 'https://pe.tiendasishop.com/cdn/shop/files/16-D-2918x1459-OD.webp?v=1761576035&width=1920',
        alt: 'Banner 1'
      },
      {
        itemImageSrc: 'https://pe.tiendasishop.com/cdn/shop/files/iPHONE-13_D-2918x1459-OD.webp?v=1761576035&width=1920',
        alt: 'Banner 2'
      },
      {
        itemImageSrc: 'https://pe.tiendasishop.com/cdn/shop/files/iPhone_17_Pro-D-2918x1459.png?v=1761258623&width=1920',
        alt: 'Banner 3'
      },
      {
        itemImageSrc: 'https://pe.tiendasishop.com/cdn/shop/files/Bopis-D-2918x1459-OD.webp?v=1761576035&width=1920',
        alt: 'Banner 4'
      },
      {
        itemImageSrc: 'https://pe.tiendasishop.com/cdn/shop/files/iPad_A_16_D-2918x1459-CYBER.webp?v=1761576035&width=1920',
        alt: 'Banner 5'
      }
    ];
  }
}
