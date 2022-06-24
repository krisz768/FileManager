import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  constructor(private metaService:Meta){
  }

  ngOnInit(): void {
    this.metaService.addTag( { name:'description',content:"Ez egy szar"});
  }
  title = 'home-page';
}
