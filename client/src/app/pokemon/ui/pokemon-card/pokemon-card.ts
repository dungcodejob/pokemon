import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
} from '@angular/core';
import { PokemonResultDto } from '@pokemon/data-access';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzTagModule } from 'ng-zorro-antd/tag';

const typeColors: { [key: string]: string } = {
  fire: 'red',
  water: 'blue',
  grass: 'green',
  electric: 'gold',
  psychic: 'magenta',
  ice: 'cyan',
  dragon: 'purple',
  dark: 'default',
  fairy: 'pink',
  normal: 'default',
  fighting: 'red',
  poison: 'purple',
  ground: 'orange',
  flying: 'geekblue',
  bug: 'lime',
  rock: 'orange',
  ghost: 'purple',
  steel: 'default',
};

@Component({
  selector: 'app-pokemon-card',
  imports: [
    NzCardModule,
    NzIconModule,
    NzButtonModule,
    NzTagModule,
    NzProgressModule,
    NzDividerModule,
    NzBadgeModule,
  ],
  templateUrl: './pokemon-card.html',
  styleUrl: './pokemon-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PKPokemonCard implements OnInit {
  data = input.required<PokemonResultDto>();

  ngOnInit(): void {}

  onOpenYouTube(): void {
    if (this.data().ytbUrl) {
      window.open(this.data().ytbUrl, '_blank');
    }
  }

  getTypeColor(typeName: string): string {
    return typeColors[typeName.toLowerCase()] || 'default';
  }
}
