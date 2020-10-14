import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: []
})
export class Grafica1Component implements OnInit {

  public label1: string[] = ['Sales 1', 'Sales 2', 'Sales 3'];
  public data1 = [
    [150, 650, 100]
   
  ];
  constructor() { }

  ngOnInit(): void {
  }

}

