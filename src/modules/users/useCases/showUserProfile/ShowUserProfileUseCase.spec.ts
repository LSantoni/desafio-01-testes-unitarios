import { User } from './../../entities/User';
import { ProfileMap } from './../../mappers/ProfileMap';
import { ICreateUserDTO } from './../createUser/ICreateUserDTO';
import { CreateUserUseCase } from './../createUser/CreateUserUseCase';
import { AuthenticateUserUseCase } from './../authenticateUser/AuthenticateUserUseCase';
import { InMemoryUsersRepository } from './../../repositories/in-memory/InMemoryUsersRepository';
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase';

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe('Show user profile', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
  });

  it('should be able to show user profile', async () => {
    const newUser: ICreateUserDTO = {
      name: 'New User',
      email: 'user@test.com',
      password: '123456'
    };

    await createUserUseCase.execute(newUser);

    const { token, user } = await authenticateUserUseCase.execute({
      email: newUser.email,
      password: newUser.password
    });

    const profileDTO = ProfileMap.toDTO(user as User);

    console.log(profileDTO);
    expect(profileDTO).toHaveProperty('id');

  });
});
