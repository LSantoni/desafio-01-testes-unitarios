import { User } from './../../../users/entities/User';
import { CreateStatementUseCase } from './../createStatement/CreateStatementUseCase';
import { CreateUserUseCase } from './../../../users/useCases/createUser/CreateUserUseCase';
import { InMemoryUsersRepository } from './../../../users/repositories/in-memory/InMemoryUsersRepository';
import { InMemoryStatementsRepository } from './../../repositories/in-memory/InMemoryStatementsRepository';
import { GetBalanceUseCase } from './GetBalanceUseCase';

let getBalanceUseCase: GetBalanceUseCase;
let statementRepositoryInMemory: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

interface IRequest {
  user_id: string;
}

describe('Get balance', () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(userRepositoryInMemory, statementRepositoryInMemory);
    getBalanceUseCase = new GetBalanceUseCase(statementRepositoryInMemory, userRepositoryInMemory);
  });

  it('should beable to get balance', async () => {
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

    const userCreated = await userRepositoryInMemory.findByEmail(user.email) as User;

    await createStatementUseCase.execute({
      user_id: userCreated?.id as string,
      type: OperationType.DEPOSIT,
      amount: 50,
      description: 'Deposit'
    });

    await createStatementUseCase.execute({
      user_id: userCreated?.id as string,
      type: OperationType.WITHDRAW,
      amount: 10,
      description: 'Withdraw'
    });

    const balance = await getBalanceUseCase.execute({ user_id: userCreated.id as string });

    expect(balance).toHaveProperty('balance');
  })
})
