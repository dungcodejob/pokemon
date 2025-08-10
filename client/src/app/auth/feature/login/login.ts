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
import { injectAutoEffect } from '@shared/utils';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { PKLoginFacade } from './login.facade';

type LoginForm = FormGroup<{
  usernameOrEmail: FormControl<string>;
  password: FormControl<string>;
}>;

@Component({
  selector: 'app-login',
  imports: [
    NzIconModule,
    NzLayoutModule,
    NzMenuModule,
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    NzButtonModule,
  ],
  providers: [PKLoginFacade],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PKLogin implements OnInit {
  private readonly _autoEffect = injectAutoEffect();
  private readonly _nonNullFB = inject(NonNullableFormBuilder);
  private readonly _loginFacade = inject(PKLoginFacade);

  $error = this._loginFacade.$error;
  $isPending = this._loginFacade.$isPending;

  loginForm!: LoginForm;

  protected get isSubmitDisabled(): boolean {
    return (
      !this.loginForm.valid || this.loginForm.pristine || this.$isPending()
    );
  }

  ngOnInit(): void {
    this.initForm();
    this.registerLoadingEffect();
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const body = this.loginForm.getRawValue();
      this._loginFacade.login({
        credentials: {
          emailOrUsername: body.usernameOrEmail,
          password: body.password,
        },
      });
    } else {
      this.loginForm.updateValueAndValidity();
    }
  }

  private initForm(): void {
    this.loginForm = this._nonNullFB.group<LoginForm['controls']>({
      usernameOrEmail: this._nonNullFB.control('', {
        validators: Validators.required,
      }),
      password: this._nonNullFB.control('', {
        validators: [Validators.required, Validators.minLength(6)],
      }),
    });
  }

  private registerLoadingEffect(): void {
    this._autoEffect(() => {
      const loading = this._loginFacade.$isPending();
      loading ? this.loginForm.disable() : this.loginForm.enable();
    });
  }
}
