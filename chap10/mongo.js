
const { MongoClient } = require('mongodb');

const uri = `mongodb+srv://dbUser:qlalfqjsgh1@cluster0.8t5vr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri,
  { useNewUrlParser: true,
    useUnifiedTopology: true
  });

async function main() {
  await client.connect()

  const users = client.db('fc21').collection('users')
  const cities = client.db('fc21').collection('cities')

  // Reset
  await users.deleteMany({})
  await cities.deleteMany({})

  // Init
  await cities.insertMany([
    {
      name: '서울',
      population: 1000,
    },
    {
      name: '부산',
      population: 350,
    },
  ])

  await users.insertMany([
    {
      name: 'Foo',
      birthYear: 2000,
      contacts: [
        {
          type: 'phone',
          number: '+82100000111'
        },
        {
          type: 'home',
          number: '+8210223311'
        },
      ],
      city: '서울',
    },
    {
      name: 'Bar',
      birthYear: 1995,
      contacts: [
        {
          type: 'phone',
        },
      ],
      city: '부산',
    },
    {
      name: 'Baz',
      birthYear: 1990,
      city: '부산',
    },
    {
      name: 'Poo',
      birthYear: 1993,
      city: '서울',
    }
  ])

  // // update 하는 법
  // await users.updateOne(
  //   {
  //     name: 'Baz'
  //   },
  //   {
  //     $set: {
  //       name: 'Boo'
  //     }
  //   }
  // )

  // // 삭제
  // await users.deleteOne({
  //   name: 'Baz',
  // })

  const cursor = users.aggregate([
    {
      $lookup: {
        from: 'cities',
        localField: 'city',
        foreignField: 'name',
        as: 'city_info',
      },
    },
    {
      $match: {
        $and: [
          {
            'city_info.population': {
              $gte: 500
            },
          },
          {
            birthYear: {
              $gte: 1995,
            }
          }
        ]
      }
    },
    {
      $count: 'num_users'
    }
  ])

  await cursor.forEach(console.log)
  await client.close()
}

main()