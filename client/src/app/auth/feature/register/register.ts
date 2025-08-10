import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ROUTES } from '@shared/constants';
import { injectAutoEffect } from '@shared/utils';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { PKRegisterFacade } from './register.facade';

type RegisterForm = FormGroup<{
  email: FormControl<string>;
  name: FormControl<string>;
  password: FormControl<string>;
}>;

@Component({
  selector: 'app-register',
  imports: [
    NzIconModule,
    NzLayoutModule,
    NzMenuModule,
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    NzButtonModule,
    RouterLink,
  ],
  providers: [PKRegisterFacade],
  templateUrl: './register.html',
  styleUrl: './register.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PKRegister implements OnInit {
  private readonly _autoEffect = injectAutoEffect();
  private readonly _nonNullFB = inject(NonNullableFormBuilder);
  private readonly _registerFacade = inject(PKRegisterFacade);

  $errorMessage = this._registerFacade.$errorMessage;
  $isPending = this._registerFacade.$isPending;
  loginLink = ROUTES.LOGIN;
  registerForm!: RegisterForm;

  protected get isSubmitDisabled(): boolean {
    return (
      !this.registerForm.valid ||
      this.registerForm.pristine ||
      this.$isPending()
    );
  }

  ngOnInit(): void {
    this.initForm();
    this.registerLoadingEffect();
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const body = this.registerForm.getRawValue();
      this._registerFacade.register({
        credentials: {
          email: body.email,
          name: body.name,
          password: body.password,
        },
      });
    } else {
      this.registerForm.updateValueAndValidity();
    }
  }

  private initForm(): void {
    this.registerForm = this._nonNullFB.group<RegisterForm['controls']>({
      email: this._nonNullFB.control('', {
        validators: [Validators.required, Validators.email],
      }),
      name: this._nonNullFB.control('', {
        validators: Validators.required,
      }),
      password: this._nonNullFB.control('', {
        validators: [Validators.required, Validators.minLength(6)],
      }),
    });
  }

  private registerLoadingEffect(): void {
    this._autoEffect(() => {
      const loading = this._registerFacade.$isPending();
      loading ? this.registerForm.disable() : this.registerForm.enable();
    });
  }
}
