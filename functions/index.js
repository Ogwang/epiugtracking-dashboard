const functions = require('firebase-functions');
const admin = require('firebase-admin')
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: 'epiugtracking',
    private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDcTnAhPaX27xwM\nphRYgjBqX8G0wIQvmA5sL+nQe5cS/ECF0qUW5S+vFWZxJ2VrpMrPvqVT5/smr6Ac\n/NtTsyPMd864QIXiULRV6CYNX6tCpZKcV2Z/ryJte2FYfFpQaHdd2VoMI6WtE8zs\nEraxNs6gmaTBsD8/Lhr3PH4ibXY48P7X0Kw8KPxkU8s5lEuYeZJIiPwlB4Ilp1iv\nxqyECB9pe5XprkNXMTEBDfYNT1D5GXhYN7USE7XiiDGoYljRwCOspQgM4+QfUhx3\nvHtpAnWR7ZCKJCGlp4Qub7iLEOdoMa7UmiZEu3tWgaK3JKL1GRWFGvjmdAkpEBgQ\niFFmSgP9AgMBAAECggEAM5hJKXfLKSBJtOqmZC4lUZxYfNEDhDP72LmF7FYthPw/\nzjeNg2Wse7gq1EBSP9oJx4qSJKr1RlOmT3OmmB0huq6qYrt1v5GAEoh6dPJdZQ/q\n3KOZdTjaesKFA1ioPCGjJv8S2Dn3AKhc+0LMt4cq8DDbhaMVxOGy3gk0TzLMl7vl\n5ZhHRsY8mBbrIfZp/ZkNIvU7jo53evKFORW6Mqrw1U8RhG3BrHg7LPo9VGYUDGLM\ni/8TjNBeghI/F6IeZcSKTVXFIUHlPHx9rtHv2/zbF2Eb/2bZMeIXr79H9yFMHelR\n1+N4+mjrIsEbrgxLy6jF6MSpj0MJ/qGrO8x+gr3GkQKBgQDzg1WYY4rtECWT0ZM9\nZhxrUBYiOfVC529zJzyPfKuNaIV0gUgkk24+/59uzYsTNZxn2646aNPsnqdajmMz\nrM/0aF7WQd7Ol3qaB2WroWPkFrAKCfMLfaaCBhkAtDGMDuVnjtue3PY2frpkpJPK\nMOfh2fi9o9qtTfFUihXBUyB+tQKBgQDnmnatJtep3TU572V5HCNhTB8uFbPq33sR\nrmsvfoxsPOy1rVzWJfHnL4jK+PTtuJD0le3R9i7gYinTU2LYHzF7e/Kw3v4jKNND\nCUKLIS7RDvS279PwsObSLKA2Fdk9Y7tZV0CJbO0ZFQ2t/K7jdV2IrFEWCrjlEo8X\nfzaaupl1KQKBgEv2gFEVXFUvYEmIawIQRHVFemIa6mOAhsfJSZ8JKQrnvBnn6nVe\neFm2rCmIfQX1B2Fuqh8WbGW36ETbfh60nfqERHFaAwM3Rcue2xx7MAoK+cdn6yV+\ngN62wD3z+DDUxMNVUTVxgGzng4W5wVCliPBvaqTd5G2DjvDsUnUIVW6xAoGBAI6b\nu+uOeUks3nNYB2F1hAuLNb/IuUosZblTbsiF4a1cLl0H7JwoLTWvPUnN1fLyrL8N\n+qxILEEZ8KshM0HkozFn9t4V0OKRZtRmRUUqH4u269QhBJ22L8rGk7f56BQ27stq\nQGDeY3gIUK4LYxzHzdo0UJGD9KmIrfdH67WGpKtRAoGBAIyw9hmyTa9iaakeHhg0\namn/r9ondqWrnlE1LsWbQdXadDeRtXgfufT6j+HNoWM0W6cq0C8wTZ8fqyuYB2LW\n17Z05EquIH+EVDAT7g3QcA21EbqJBQ9JjSlN7eLmMivKMmbu5G10vfR468+lZppr\nGJywDN6JaV04s88KR+QWHPCe\n-----END PRIVATE KEY-----\n',
    client_email: 'system-160@epiugtracking.iam.gserviceaccount.com'
  }),
  databaseURL: 'https://epiugtracking.firebaseio.com/'
})

const symptomMap = {
  '1': 'fever',
  '2': 'Malaise',
  '3': 'Muscle Pain',
  '4': 'Head ache',
  '5': 'Weakness/Fatigue',
  '6': 'Sore Throat',
  '7': 'Vomiting',
  '8': 'Diarrhea',
  '9': 'Rash',
  '10': 'Haemorrhage',
  '11': 'Hiccups',
  '12': 'Others'
}

function resolveSymptom (txt) {
  return txt.split(' ').map(key => symptomMap[key]).join(',')
}

exports.events = functions.https.onRequest((req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed')
    return
  }
  const db = admin.database()

  const message = req.body.message
  const symptom = resolveSymptom(message)
  const numberOfCases = req.body.numberOfCases
  const numberOfDeaths = req.body.numberOfDeaths
  const phoneNumber = req.body.phoneNumber
  const refId = req.body.id

  // find facility
  let facility = '0230'
  console.log('name' + req.body.village)

  db.ref('villageMap').child(req.body.village).once('value', snap => {
    let village = snap.val()
    if (village === null) {
      village = 120343
    }
    console.log('code' + village)
    return db.ref('villages').child(village).once('value', snap => {
      const v = snap.val()
      facility = v.facility

      const ref = db.ref('events').push()
      ref.set({
        message: message,
        numberOfCases: numberOfCases,
        numberOfDeaths: numberOfDeaths,
        phoneNumber: phoneNumber,
        facility: facility,
        village: village,
        refId: refId,
        symptom: symptom
      })
      res.send('ok')
    }, () => {
      res.send('fail')
    })
  }, () => {
    res.send('fail')
  })
})

exports.confirm = functions.https.onRequest((req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed')
    return
  }

  // find the first pending event
  const db = admin.database()
  db.ref('events').limitToLast(1).once('value').then((snapshot) => {
    console.log(snapshot)
    console.log(snapshot.numChildren())
    snapshot.forEach(function(item) {
      var itemVal = item.val();

      const ref = db.ref('cases').push()
      ref.set({
        message: itemVal.message,
        numberOfDeaths: itemVal.numberOfDeaths,
        numberOfCases: itemVal.numberOfCases,
        event: item.key,
        facility: itemVal.facility,
        village: itemVal.village,
        disease: 'ebola',
        radius: 10000
      })

      db.ref('events').child(item.key).update({
        resolve: true
      })

      res.send('ok')
    })
  }, () => {
    console.log('fail')
    res.send('ok')
  })
})

exports.daily = functions.https.onRequest((req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed')
    return
  }
  const db = admin.database()
  db.ref('cases').limitToLast(1).once('value').then(snap => {
    snap.forEach(item => {
      console.log(item)
    })
  })

})
