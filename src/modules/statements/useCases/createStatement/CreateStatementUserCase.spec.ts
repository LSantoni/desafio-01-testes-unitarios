import { InMemoryStatementsRepository } from '@modules/statements/repositories/in-memory/InMemoryStatementsRepository';
import { InMemoryUsersRepository } from '@modules/users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from '@modules/users/useCases/createUser/CreateUserUseCase';
import { CreateStatementUseCase } from './CreateStatementUseCase';

let createStatementUseCase: CreateStatementUseCase;
let statementRepositoryInMemory: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('Create Statement', () => {
  beforeEach(() => {
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    userRepositoryInMemory = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(userRepositoryInMemory, statementRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
  });

  it('it should be able to make a deposit', async () => {
    const user = {
      name: 'New User',
      email: 'user@test.com',
      password: '123456'
    };

    await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password
    });

    const userCreated = await userRepositoryInMemory.findByEmail(user.email);

    const statement = await createStatementUseCase.execute({
      user_id: userCreated?.id as string,
      type: OperationType.DEPOSIT,
      amount: 50,
      description: 'Deposit'
    });

    expect(statement).toHaveProperty('id');
  });

  it('it should be able to make a withdraw', async () => {
    const user = {
      name: 'New User',
      email: 'user@test.com',
      password: '123456'
    };

    await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password
    });

    const userCreated = await userRepositoryInMemory.findByEmail(user.email);

    await createStatementUseCase.execute({
      user_id: userCreated?.id as string,
      type: OperationType.DEPOSIT,
      amount: 50,
      description: 'Deposit'
    });

    const statement = await createStatementUseCase.execute({
      user_id: userCreated?.id as string,
      type: OperationType.WITHDRAW,
      amount: 10,
      description: 'Withdraw'
    });

    expect(statement).toHaveProperty('id');
  });

})
