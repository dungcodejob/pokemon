import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PokemonFilterDto } from '@pokemon/data-access';
import { PKPokemonCard } from '@pokemon/ui';
import { ROUTES } from '@shared/constants';
import { injectAutoEffect } from '@shared/utils';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { PKPokemonManagementFacade } from './pokemon-management.facade';

@Component({
  selector: 'app-pokemon-management',
  imports: [
    PKPokemonCard,
    NzAlertModule,
    NzGridModule,
    NzPaginationModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    FormsModule,
    NzSpinModule,
    NzSwitchModule,
    NzAlertModule,
  ],
  providers: [PKPokemonManagementFacade],
  templateUrl: './pokemon-management.html',
  styleUrl: './pokemon-management.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PKPokemonManagement implements OnInit {
  private readonly _autoEffect = injectAutoEffect();
  private readonly _pokemonManagementFacade = inject(PKPokemonManagementFacade);
  private readonly _router = inject(Router);
  private readonly _searchKeySubject = new Subject<string>();
  private readonly _destroyRef = inject(DestroyRef);

  $errorMessage = this._pokemonManagementFacade.$errorMessage;
  $isPending = this._pokemonManagementFacade.$isPending;
  $pokemonList = this._pokemonManagementFacade.$pokemonList;
  $totalPages = this._pokemonManagementFacade.$totalPages;
  $totalCount = this._pokemonManagementFacade.$totalCount;
  $pageSize = this._pokemonManagementFacade.$pageSize;
  $currentPage = this._pokemonManagementFacade.$currentPage;
  $searchValue = this._pokemonManagementFacade.$name;
  $legendary = this._pokemonManagementFacade.$legendary;
  $typeIds = this._pokemonManagementFacade.$typeIds;
  $sortBy = this._pokemonManagementFacade.$sortBy;
  $sortOrder = this._pokemonManagementFacade.$sortOrder;
  $isImportPending = this._pokemonManagementFacade.$isImportPending;
  $isImportFulfilled = this._pokemonManagementFacade.$isImportFulfilled;
  $importErrorMessage = this._pokemonManagementFacade.$importErrorMessage;

  registerLink = ROUTES.REGISTER;

  ngOnInit(): void {
    this.registerFilterChangeEffect();
    this.registerImportSuccessEffect();
    this.syncFilterToUrl();
    this.listenSearchKeyChange();
  }

  constructor() {}

  onLegendaryChange(value: boolean) {
    this._pokemonManagementFacade.setLegendary({ legendary: value });
  }

  onSearchChange(value: string) {
    this._searchKeySubject.next(value);
  }

  onCurrentPageChange(page: number) {
    this._pokemonManagementFacade.setPagination({
      pagination: {
        currentPage: page,
        pageSize: this.$pageSize(),
      },
    });
  }

  onPageSizeChange(pageSize: number) {
    this._pokemonManagementFacade.setPagination({
      pagination: {
        currentPage: 1,
        pageSize,
      },
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log('Selected file:', file.name);

      this._pokemonManagementFacade.import({ file });

      // Reset the input value so the same file can be selected again
      input.value = '';
    }
  }

  private listenSearchKeyChange() {
    this._searchKeySubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe((value) => {
        this._pokemonManagementFacade.setName({ name: value });
      });
  }

  private registerFilterChangeEffect() {
    this._autoEffect(() => {
      const filter: PokemonFilterDto = {
        name: this.$searchValue(),
        legendary: this.$legendary(),
        typeIds: this.$typeIds() ?? undefined,
        pagination: {
          currentPage: this.$currentPage(),
          pageSize: this.$pageSize(),
        },
      };
      this._pokemonManagementFacade.find({ filter });
    });
  }

  private registerImportSuccessEffect() {
    this._autoEffect(() => {
      const isImportPending = this.$isImportPending();
      const isImportFulfilled = this.$isImportFulfilled();

      if (!isImportPending && isImportFulfilled) {
        const filter: PokemonFilterDto = {
          name: this.$searchValue(),
          legendary: this.$legendary(),
          typeIds: this.$typeIds() ?? undefined,
          pagination: {
            currentPage: this.$currentPage(),
            pageSize: this.$pageSize(),
          },
        };
        this._pokemonManagementFacade.find({ filter });
      }
    });
  }

  private syncFilterToUrl() {
    this._autoEffect(() => {
      this._router.navigate([], {
        queryParams: {
          currentPage: this.$currentPage(),
          pageSize: this.$pageSize(),
          name: this.$searchValue(),
          legendary: this.$legendary(),
          typeIds: this.$typeIds(),
          sortBy: this.$sortBy(),
          sortOrder: this.$sortOrder(),
        },
        queryParamsHandling: 'merge',
      });
    });
  }
}
