import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';


import { SearchService } from '../search.service';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.css']
})
export class SearchbarComponent implements OnInit {
  @Output() search = new EventEmitter<string>();

  private searchControl: FormControl;
  private completionSuggestions: string[] = [];

  constructor(
    private searchService: SearchService
  ) { }

  ngOnInit() {
    this.searchControl = new FormControl('');
    this.searchControl.valueChanges.subscribe(
      () => { this.suggestCompletion(); }
    );
  }

  suggestCompletion() {
    let queryString = this.searchControl.value;
    this.searchService.autocompleteSearchQuery(queryString).subscribe(
      result => { this.completionSuggestions = result; }
    );
  }

  validateSearch() {
    this.search.emit(this.searchControl.value);
  }
}
