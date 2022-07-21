import { Directive, Output, EventEmitter, HostBinding, HostListener} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Directive({
  selector: '[appUploadFileDirective]'
})
export class UploadFileDirectiveDirective {

  @Output() files: EventEmitter<File[]> = new EventEmitter();

  @HostBinding("style.background") private background = "#424242";

  constructor(private sanitizer: DomSanitizer) { }

  @HostListener("dragover", ["$event"]) public onDragOver(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = "#999";
  }

  @HostListener("dragleave", ["$event"]) public onDragLeave(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#424242';
  }

  @HostListener('drop', ['$event']) public onDrop(evt: DragEvent) {
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#424242';

    const { dataTransfer } = evt;
  
    let files: File[] = [];
    for (let i = 0; i < evt.dataTransfer!.files.length; i++) {
      if ( evt.dataTransfer!.items[i].kind === 'file') {
        const file = evt.dataTransfer!.files[i];
        files.push(file);
      }
    }
    if (files.length > 0) {
      this.files.emit(files);
    }
  }
}
