import { User } from './../../../users/entities/User';
import { GetStatementOperationUseCase } from './GetStatementOperationUseCase';
import { CreateStatementUseCase } from './../createStatement/CreateStatementUseCase';
import { InMemoryUsersRepository } from './../../../users/repositories/in-memory/InMemoryUsersRepository';
import { CreateUserUseCase } from './../../../users/useCases/createUser/CreateUserUseCase';
import { InMemoryStatementsRepository } from './../../repositories/in-memory/InMemoryStatementsRepository';

let statementRepositoryInMemory: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('Get balance', () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
    statementRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(userRepositoryInMemory, statementRepositoryInMemory);
    getStatementOperationUseCase = new GetStatementOperationUseCase(userRepositoryInMemory, statementRepositoryInMemory);
  });

  it('should beable to get operation', async () => {
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

    const statement = await createStatementUseCase.execute({
      user_id: userCreated?.id as string,
      type: OperationType.DEPOSIT,
      amount: 50,
      description: 'Deposit'
    });

    const response = await getStatementOperationUseCase.execute({ user_id: userCreated.id as string, statement_id: statement.id as string });

    expect(statement).toHaveProperty('id');
  })
})
