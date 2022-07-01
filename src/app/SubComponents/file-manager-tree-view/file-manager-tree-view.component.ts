import { Component, OnInit,Input } from '@angular/core';
import {SelectionChange} from '@angular/cdk/collections';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import { DirNode } from "../../DirDataModel";
import {ApiConnectionService} from '../../Services/api-connection.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-file-manager-tree-view',
  templateUrl: './file-manager-tree-view.component.html',
  styleUrls: ['./file-manager-tree-view.component.css']
})
export class FileManagerTreeViewComponent implements OnInit {

  constructor(private apiConnectionService: ApiConnectionService,  private _MatSnackBar : MatSnackBar) { }

  @Input() StartingData : DirNode[] = [];

  DirTree: DirNode[] = [];

  ngOnInit(): void {
    this.DirTree = this.StartingData;
    this.dataSource.data = this.DirTree;

    this.treeControl.expansionModel.changed.subscribe(change => {
      if ((change as SelectionChange<DirNode>).added) {
        this.OnExpand(change as SelectionChange<DirNode>);
      }
    });
  }

  OnExpand(change: SelectionChange<DirNode>) {
    change.added.forEach(node => {node.isLoading = true; this.LoadSubDir(node)});
  }

  LoadSubDir(Node : DirNode) {
    if (!Node.isFile) {
      this.apiConnectionService.GetDirList([Node.path, "/", Node.name].join('')).subscribe((data) => {
      
        if (!data.error) {
          Node.children = data.data;
          Node.children?.forEach((node) => {node.path = [Node.path, "/", Node.name].join('')});
          Node.isLoading = false;
          this.dataSource.data = [];
          this.dataSource.data = this.DirTree;
        } else {
          Node.isLoading = false;
          this._MatSnackBar.open(this.apiConnectionService.ErrorCodesToString(data.data), "Bezárás");
        }
      }, (error) => {this._MatSnackBar.open("Hiba történt a szerver elérése közben.", "Bezárás"); Node.isLoading = false;}
      );
    }
  }

  treeControl = new NestedTreeControl<DirNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<DirNode>();

  isDirectory = (_: number, node: DirNode) => {return !node.isFile}
}
