import { Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { applicationConfig } from '@storybook/angular';
import { TranslateModule } from '@ngx-translate/core';
import { storybookTranslateConfig } from '../app/shared/config/translate';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EditProfileComponent } from '../app/components/edit-profile/edit-profile.component';
import { AuthService, UserService, MediaService } from '../app/services';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { USERS } from '../app/services/mocks/users';

const meta: Meta<EditProfileComponent> = {
  title: 'Components/Edit Profile',
  component: EditProfileComponent,
  decorators: [
    applicationConfig({
      providers: [
        provideAnimations(),
        provideHttpClient(withFetch()),
        {
          provide: MatDialogRef,
          useValue: {
            close: () => {},
            closeAll: () => {},
          },
        },
        {
          provide: UserService,
          useValue: {
            updateUserProfile: () => Promise.resolve(),
            getUserProfileById: () => Promise.resolve(null),
          },
        },
        {
          provide: AuthService,
          useValue: {
            login: () => of(void 0),
            logout: () => of(void 0),
            register: () => of(void 0),
            user$: of(null),
            currentUserSignal: signal(USERS[0]),
          },
        },
        {
          provide: MediaService,
          useValue: {
            uploadUserAvatar: () => of('https://example.com/avatar.jpg'),
            uploadImage: () => of('https://example.com/image.jpg'),
            uploadPostImage: () => of('https://example.com/post.jpg'),
          },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {},
        },
      ],
    }),
    moduleMetadata({
      imports: [TranslateModule.forRoot(storybookTranslateConfig)],
    }),
  ],
};

export default meta;
type Story = StoryObj<EditProfileComponent>;

export const Primary: Story = {
  args: {},
  render: () => ({
    template: `
      <div style="max-width: 600px;">
        <app-edit-profile></app-edit-profile>
      </div>
    `,
  }),
};
