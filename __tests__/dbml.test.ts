import {
  datamodelDbml,
  datamodelDbmlComments,
  datamodelDbmlDefaults,
  datamodelDbmlManyToMany,
  datamodelDbmlManyToManyInvalid,
  datamodelDbmlManyToManyRenameRelation,
  datamodelDbmlManyToManySelfRelation,
  datamodelDbmlReferentialActions,
  datamodelDbmlRelations,
} from './fixtures/dbml.datamodel';
import { generateDMMF } from './utils/generateDMMF';
import {
  autoGeneratedComment,
  generateDBMLSchema,
} from '../src/generator/dbml';

describe('DBML', () => {
  test('generating simple dbml schema', async () => {
    const dmmf = await generateDMMF(datamodelDbml);

    const expectedDbml = `${autoGeneratedComment}

Table User {
  id Int [pk, increment]
  name String [not null]
  profile Profile
  role Role [not null]
}

Table Profile {
  id Int [pk, increment]
  name String [not null]
  user User [not null]
  userId Int [unique, not null]
}

Enum Role {
  ADMIN
  USER
}

Ref: Profile.userId - User.id`;

    const dbml = generateDBMLSchema(dmmf);

    expect(dbml).toEqual(expectedDbml);
  });

  test('generating dbml schema with comments', async () => {
    const dmmf = await generateDMMF(datamodelDbmlComments);

    const expectedDbml = `${autoGeneratedComment}

Table User {
  id Int [pk, increment]
  name String [not null]
  profile Profile
  role Role [not null, default: 'USER', note: 'User\\'s Role']
}

Table Profile {
  id Int [pk, increment]
  name String [not null]
  user User [not null]
  userId Int [unique, not null]

  Note: 'User\\'s Profile model'
}

Enum Role {
  ADMIN
  USER
}

Ref: Profile.userId - User.id`;

    const dbml = generateDBMLSchema(dmmf);

    expect(dbml).toEqual(expectedDbml);
  });

  test('generating dbml schema with defaults', async () => {
    const dmmf = await generateDMMF(datamodelDbmlDefaults);

    const expectedDbml = `${autoGeneratedComment}

Table User {
  id String [pk]
  createdAt DateTime [default: \`now()\`, not null]
  name String
  email String [unique, not null]
  role Role [not null, default: 'USER']
  posts Post [not null]
}

Table Post {
  id Int [pk, increment]
  createdAt DateTime [default: \`now()\`, not null]
  updatedAt DateTime [not null]
  published Boolean [not null, default: false]
  title String [not null]
  author User
  authorId String
}

Enum Role {
  ADMIN
  USER
}

Ref: Post.authorId > User.id`;

    const dbml = generateDBMLSchema(dmmf);

    expect(dbml).toEqual(expectedDbml);
  });

  test('generating dbml schema with relationships', async () => {
    const dmmf = await generateDMMF(datamodelDbmlRelations);

    const expectedDbml = `${autoGeneratedComment}

Table User {
  id Int [pk, increment]
  posts Post [not null]
  profile Profile
}

Table Profile {
  id Int [pk, increment]
  user User [not null]
  userId Int [unique, not null]
}

Table Post {
  id Int [pk, increment]
  author User [not null]
  authorId Int [not null]
}

Ref: Profile.userId - User.id

Ref: Post.authorId > User.id`;

    const dbml = generateDBMLSchema(dmmf);

    expect(dbml).toEqual(expectedDbml);
  });

  test('generating dbml schema with many-to-many relationship', async () => {
    const dmmf = await generateDMMF(datamodelDbmlManyToMany);

    const expectedDbml = `${autoGeneratedComment}

Table Post {
  id Int [pk, increment]
  categories Category [not null]
}

Table Category {
  id Int [pk, increment]
  posts Post [not null]
}

Table Author {
  id Int [pk, increment]
  books Book [not null]
}

Table Book {
  id Int [pk, increment]
  authors Author [not null]
}

Table CategoryToPost {
  categoriesId Int [ref: > Category.id]
  postsId Int [ref: > Post.id]
}

Table AuthorToBook {
  booksId Int [ref: > Book.id]
  authorsId Int [ref: > Author.id]
}`;

    const dbml = generateDBMLSchema(dmmf);

    expect(dbml).toEqual(expectedDbml);
  });

  test('generating dbml schema with many-to-many relationship', async () => {
    const dmmf = await generateDMMF(datamodelDbmlManyToMany);

    const expectedDbml = `${autoGeneratedComment}

Table Post {
  id Int [pk, increment]
  categories Category [not null]
}

Table Category {
  id Int [pk, increment]
  posts Post [not null]
}

Table Author {
  id Int [pk, increment]
  books Book [not null]
}

Table Book {
  id Int [pk, increment]
  authors Author [not null]
}`;

    const dbml = generateDBMLSchema(dmmf, false);

    expect(dbml).toEqual(expectedDbml);
  });

  test('generating dbml schema with many-to-many self relationship', async () => {
    const dmmf = await generateDMMF(datamodelDbmlManyToManySelfRelation);

    const expectedDbml = `${autoGeneratedComment}

Table User {
  id Int [pk, increment]
  followers User [not null]
  following User [not null]
}

Table Followers {
  followersId Int [ref: > User.id]
  followingId Int [ref: > User.id]
}`;

    const dbml = generateDBMLSchema(dmmf);

    expect(dbml).toEqual(expectedDbml);
  });

// FIXME - still necessary to test?
//   test('generating dbml schema with invalid many-to-many', async () => {
//     const dmmf = await generateDMMF(datamodelDbmlManyToManyInvalid);

//     const expectedDbml = `${autoGeneratedComment}

// Table User {
//   id Int [pk, increment]
//   receivedPosts Post [not null]
// }

// Table Post {
//   id Int [pk, increment]
//   receivedBy User [not null]
// }`;

//     const dbml = generateDBMLSchema(dmmf);

//     expect(dbml).toEqual(expectedDbml);
//   });
//   test('generating dbml schema with invalid many-to-many', async () => {
//     const dmmf = await generateDMMF(datamodelDbmlManyToManyInvalid);

//     const expectedDbml = `${autoGeneratedComment}

// Table User {
//   id Int [pk, increment]
//   receivedPosts Post [not null]
// }

// Table Post {
//   id Int [pk, increment]
//   receivedBy User [not null]
// }`;

//     const dbml = generateDBMLSchema(dmmf);

//     expect(dbml).toEqual(expectedDbml);
//   });
  
  test('generating dbml schema with rename many-to-many', async () => {
    const dmmf = await generateDMMF(datamodelDbmlManyToManyRenameRelation);

    const expectedDbml = `${autoGeneratedComment}

Table User {
  id Int [pk, increment]
  receivedPosts Post [not null]
}

Table Post {
  id Int [pk, increment]
  receivedBy User [not null]
}

Table userReceivesPosts {
  receivedpostsId Int [ref: > Post.id]
  receivedbyId Int [ref: > User.id]
}`;

    const dbml = generateDBMLSchema(dmmf);

    expect(dbml).toEqual(expectedDbml);
  });

  test('generating dbml schema with referential actions', async () => {
    const dmmf = await generateDMMF(datamodelDbmlReferentialActions);

    const expectedDbml = `${autoGeneratedComment}

Table User {
  id Int [pk, increment]
  profile Profile
  posts Post [not null]
}

Table Profile {
  id Int [pk, increment]
  user User [not null]
  userId Int [unique, not null]
}

Table Post {
  id Int [pk, increment]
  author User
  authorId Int
}

Ref: Profile.userId - User.id [delete: Cascade]

Ref: Post.authorId > User.id [delete: Set Null]`;

    const dbml = generateDBMLSchema(dmmf);

    expect(dbml).toEqual(expectedDbml);
  });
});
