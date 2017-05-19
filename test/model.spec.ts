/* eslint-env node, mocha*/

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

import { Plump, Model, Schema, ModelData, MemoryStore } from 'plump';
import { TestType } from './testType';
import { LocalForageStore } from '../src/index';

const store = new LocalForageStore({
  terminal: true,
  name: 'Plump TEST Storage',
  storeName: 'localCache',
});

const plump = new Plump();

chai.use(chaiAsPromised);
const expect = chai.expect;

before(() => {
  return plump.setTerminal(store)
  .then(() => plump.addType(TestType));
});

describe('model', () => {
  describe('basic functionality', () => {
    it('should return promises to existing data', () => {
      const one = new TestType({ id: 1, name: 'potato' }, plump);
      return expect(one.get()).to.eventually.have.deep.property('attributes.name', 'potato');
    });

    it('should let you subscribe to relationships that are empty', () => {
      @Schema({
        name: 'smallType',
        idAttribute: 'id',
        attributes: {
          id: { type: 'number' },
        },
        relationships: {
          children: {
            type: {
              sides: {
                parents: { otherType: 'smallType', otherName: 'children' },
                children: { otherType: 'smallType', otherName: 'parents' },
              },
            },
          },
          parents: {
            type: {
              sides: {
                parents: { otherType: 'smallType', otherName: 'children' },
                children: { otherType: 'smallType', otherName: 'parents' },
              },
            },
          },
        },
      })
      class MiniModel extends Model<ModelData> { }

      const tinyPlump = new Plump();
      return tinyPlump.addType(MiniModel)
      .then(() => tinyPlump.setTerminal(new LocalForageStore({
        name: 'Plump MINI Storage',
        storeName: 'miniCache',
        terminal: true
      })))
      .then(() => new MiniModel({id: 101}, tinyPlump).save())
      .then((i) => {
        return new Promise((resolve, reject) => {
          return tinyPlump.find({typeName: 'smallType', id: i.id})
          .asObservable()
          .subscribe((v) => {
            if (v && v.relationships && v.relationships.children) {
              expect(v.relationships.children).to.deep.equal([]);
              resolve();
            }
          });
        })
      });
    });

    it('should load data from datastores', () => {
      return store.writeAttributes({ typeName: 'tests', attributes: { name: 'potato' } })
      .then(createdObject => {
        const two = plump.find({ typeName: 'tests', id: createdObject.id });
        return expect(two.get()).to.eventually.have.deep.property('attributes.name', 'potato');
      });
    });

    it('should create an id when one is unset', () => {
      const noID = new TestType({ name: 'potato' }, plump);
      return noID.save()
      .then(() => noID.get())
      .then((v) => {
        expect(v.id).to.not.be.null;
        expect(v.attributes.id).to.not.be.null;
        expect(v.id).to.equal(v.attributes.id);
      });
    });

    it('should allow the creation of new models with an existing id', () => {
      const otherPlump = new Plump();
      return otherPlump.setTerminal(new LocalForageStore({
        name: 'Plump Third Storage',
        storeName: 'threeCache',
        terminal: true
      }))
      .then(() => otherPlump.addType(TestType))
      .then(() => new TestType({ name: 'potato', id: 101 }, otherPlump).save())
      .then(() => otherPlump.find({ typeName: 'tests', id: 101 }).get())
      .then((v) => {
        expect(v).to.have.property('id', 101);
        expect(v.attributes).to.have.property('id', 101);
      });
    });

    it('should allow data to be deleted', () => {
      const one = new TestType({ name: 'potato' }, plump);
      return one.save()
      .then(() => {
        return expect(plump.find({ typeName: 'tests', id: one.id }).get())
        .to.eventually.have.deep.property('attributes.name', 'potato');
      })
      .then(() => one.delete())
      .then(() => plump.find({ typeName: 'tests', id: one.id }).get())
      .then((v) => expect(v).to.be.null);
    });

    it('should allow fields to be loaded', () => {
      const one = new TestType({ name: 'p', otherName: 'q' }, plump);
      return one.save()
      .then(() => {
        return expect(plump.find({ typeName: 'tests', id: one.id }).get())
        .to.eventually.have.deep.property('attributes.name', 'p');
      })
      .then(() => {
        return expect(plump.find({ typeName: 'tests', id: one.id }).get(['attributes', 'relationships']))
        .to.eventually.deep.equal(
          {
            typeName: 'tests',
            id: one.id,
            attributes: { name: 'p', otherName: 'q', id: one.id, extended: {} },
            relationships: {
              parents: [],
              children: [],
              valenceParents: [],
              valenceChildren: [],
              queryParents: [],
              queryChildren: [],
            },
          }
        );
      });
    });

    it('should dirty-cache updates that have not been saved', () => {
      const one = new TestType({ name: 'potato' }, plump);
      return one.save()
      .then(() => {
        one.set({ name: 'rutabaga' });
        return Promise.all([
          expect(one.get()).to.eventually.have.deep.property('attributes.name', 'rutabaga'),
          expect(plump.get(one)).to.eventually.have.deep.property('attributes.name', 'potato'),
        ]);
      }).then(() => {
        return one.save();
      }).then(() => {
        return expect(plump.get(one))
        .to.eventually.have.deep.property('attributes.name', 'rutabaga');
      });
    });

    it('should only load base fields on get()', () => {
      const one = new TestType({ name: 'potato', otherName: 'schmotato' }, plump);
      return one.save()
      .then(() => {
        // const hasManys = Object.keys(TestType.$fields).filter(field => TestType.$fields[field].type === 'hasMany');

        return plump.find({ typeName: 'tests', id: one.id }).get();
      }).then(data => {
        const baseFields = Object.keys(TestType.schema.attributes);

        // NOTE: .have.all requires list length equality
        expect(data).to.have.property('attributes')
        .with.all.keys(baseFields);
        expect(data).to.have.property('relationships').that.is.empty; // tslint:disable-line no-unused-expression
      });
    });

    it('should optimistically update on field updates', () => {
      const one = new TestType({ name: 'potato' }, plump);
      return one.save()
      .then(() => one.set({ name: 'rutabaga' }))
      .then(() => expect(one.get()).to.eventually.have.deep.property('attributes.name', 'rutabaga'));
    });
  });

  describe('relationships', () => {
    it('should show empty hasMany lists as {key: []}', () => {
      const one = new TestType({ name: 'frotato' }, plump);
      return one.save()
      .then(() => one.get('relationships.children'))
      .then((v) => expect(v.relationships.children).to.deep.equal([]));
    });

    it('should add hasMany elements', () => {
      const one = new TestType({ name: 'frotato' }, plump);
      return one.save()
      .then(() => one.add('children', { id: 100 }).save())
      .then(() => one.get('relationships.children'))
      .then((v) => expect(v.relationships.children).to.deep.equal([{ id: 100 }]));
    });

    it('should add hasMany elements by child field', () => {
      const one = new TestType({ name: 'frotato' }, plump);
      return one.save()
      .then(() => one.add('children', { id: 100 }).save())
      .then(() => one.get('relationships.children'))
      .then((v) => expect(v.relationships.children).to.deep.equal([{ id: 100 }]));
    });

    it('should add several hasMany elements by child field', () => {
      const one = new TestType({ name: 'frotato' }, plump);
      return one.save()
      .then(() => one.add('children', { id: 100 }).add('children', { id: 101 }).save())
      .then(() => one.get('relationships.children'))
      .then((v) => expect(v.relationships.children).to.deep.equal([{ id: 100 }, { id: 101 }]));
    });

    it('should remove hasMany elements', () => {
      const one = new TestType({ name: 'frotato' }, plump);
      return one.save()
      .then(() => one.add('children', { id: 100 }).save())
      .then(() => one.get('relationships.children'))
      .then((v) => expect(v.relationships.children).to.deep.equal([{ id: 100 }]))
      .then(() => one.remove('children', { id: 100 }).save())
      .then(() => one.get('relationships.children'))
      .then((v) => expect(v.relationships.children).to.deep.equal([]));
    });

    it('should include valence in hasMany operations', () => {
      const one = new TestType({ name: 'grotato' }, plump);
      return one.save()
      .then(() => one.add('valenceChildren', { id: 100, meta: { perm: 1 } }).save())
      .then(() => one.get('relationships.valenceChildren'))
      .then((v) => expect(v.relationships.valenceChildren).to.deep.equal([{ id: 100, meta: { perm: 1 } }]))
      .then(() => one.modifyRelationship('valenceChildren', { id: 100, meta: { perm: 2 } }).save())
      .then(() => one.get('relationships.valenceChildren'))
      .then((v) => expect(v.relationships.valenceChildren).to.deep.equal([{ id: 100, meta: { perm: 2 } }]));
    });
  });

});
