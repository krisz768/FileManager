import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';
import {SelectionChange} from '@angular/cdk/collections';
import {NestedTreeControl} from '@angular/cdk/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import { DirNode } from "../../DirDataModel";
import {ApiConnectionService} from '../../Services/api-connection.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { enableDebugTools } from '@angular/platform-browser';
import { ResponseModel } from 'src/app/ResponseModel';

@Component({
  selector: 'app-file-manager-tree-view',
  templateUrl: './file-manager-tree-view.component.html',
  styleUrls: ['./file-manager-tree-view.component.css']
})
export class FileManagerTreeViewComponent implements OnInit {

  constructor(private apiConnectionService: ApiConnectionService,  private _MatSnackBar : MatSnackBar) { }

  @Input() StartingData : DirNode[] = [];

  @Input() Path : {Path : string, IsFile : boolean} = {Path : "/", IsFile : false};
  @Output() PathChange = new EventEmitter<{Path : string, IsFile : boolean}>();

  @Input() PrevPeth : {Path : string, IsFile : boolean}[] = [];
  @Output() PrevPethChange = new EventEmitter<{Path : string, IsFile : boolean}[]>();

  DirTree: DirNode[] = [];

  ngOnInit(): void {
    this.DirTree = JSON.parse(JSON.stringify(this.StartingData));
    this.dataSource.data = this.DirTree;

    this.treeControl.expansionModel.changed.subscribe(change => {
      if ((change as SelectionChange<DirNode>).added) {
        this.OnExpand(change as SelectionChange<DirNode>);
      }
      if ((change as SelectionChange<DirNode>).removed) {
        this.OnCollapse(change as SelectionChange<DirNode>);
      }
    });
  }

  OnExpand(change: SelectionChange<DirNode>) {
    change.added.forEach(node => {this.LoadSubDir(node);});
  }

  OnCollapse(change: SelectionChange<DirNode>) {
    change.removed.forEach(node => {
      node.children = undefined; 
      this.dataSource.data = [];
      this.dataSource.data = this.DirTree;
    });
  }

  async LoadSubDir(Node : DirNode) {
    if (!Node.isFile) {
      let Done : boolean = false;

      setTimeout(() => {
        if (!Done) {
          Node.isLoading = true;
        }
      }, 200);

      const DirData = await this.apiConnectionService.GetDirList([Node.path, "/", Node.name].join(''));

      if (!DirData.error) {
        Done = true;
        Node.children = DirData.data;
        Node.children?.forEach((node) => {node.path = [Node.path, "/", Node.name].join('')});
        Node.isLoading = false;
        this.dataSource.data = [];
        this.dataSource.data = this.DirTree;
      } else {
        Done = true;
        Node.isLoading = false;
        this.dataSource.data = [];
        this.dataSource.data = this.DirTree;
        this._MatSnackBar.open(this.apiConnectionService.ErrorCodesToString(DirData.data), "Bezárás");
      }
    }
  }

  async ReloadData(StartingData : ResponseModel) {
    //const BaseDirData = await this.apiConnectionService.GetDirList("/");
    const BaseDirData : ResponseModel = StartingData;
    if (!BaseDirData.error) {
      if (this.IsChanged(this.dataSource.data,BaseDirData.data)) {
        this.DirTree = BaseDirData.data;
        this.dataSource.data = [];
        this.dataSource.data = this.DirTree;
      } else {
        await this.UpdateReqursiveIfChanged(this.DirTree);
        this.dataSource.data = [];
        this.dataSource.data = this.DirTree;
      }
    } else {
      this._MatSnackBar.open(this.apiConnectionService.ErrorCodesToString(BaseDirData.data), "Bezárás");
    }
  }

  async UpdateReqursiveIfChanged(list : DirNode[]) {
    for (const objects of list) {
      if(!objects.isFile && objects.children != undefined) {
        const NewList = await this.apiConnectionService.GetDirList([objects.path, "/", objects.name].join(''));
        if (!NewList.error) {
          if (this.IsChanged(objects.children, NewList.data)) {
            objects.children = NewList.data;
            objects.children?.forEach((node) => {node.path = [objects.path, "/", objects.name].join('')});
          } else {
            await this.UpdateReqursiveIfChanged(objects.children);
          }
        } else {
          this._MatSnackBar.open(this.apiConnectionService.ErrorCodesToString(NewList.data), "Bezárás");
        }
      }
    }
  }

  IsChanged(oldList : DirNode[], newList : DirNode[]) : boolean {
    if (oldList.length == newList.length) {
      for (const old of oldList) {
        let exist = false;
        for (const newl of newList) {
          if (old.name == newl.name) {
            exist = true;
          }
        }
        if(!exist) {return true;}
      }
    }else {
      return true;
    }
    return false;
  }

  OnNodeClick(Node : DirNode) {
    let path = [Node.path, "/", Node.name, "/"].join('');

    if (this.Path.IsFile || Node.isFile) {
      this.PrevPeth.push({Path: this.Path.Path, IsFile: this.Path.IsFile});
      this.PrevPethChange.emit(this.PrevPeth);
      history.pushState(null, '', window.location.href);
    }

    this.Path = {Path: path, IsFile: Node.isFile};
    this.PathChange.emit(this.Path);
  }

  treeControl = new NestedTreeControl<DirNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<DirNode>();

  isDirectory = (_: number, node: DirNode) => {return !node.isFile}
}
