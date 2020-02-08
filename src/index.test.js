require('dotenv').config();
const request = require('supertest');
const app = require('./server');

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNrMnh3ZG5vbzAwemswNzcyaTF1OXBnbTQiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE1NzM2ODY2MTYsImV4cCI6MTU3MzcyOTgxNn0.7emjjYvcO09wwx30hrW-ORX_gaXoOjsRTAEZcE0xTlM';

// describe('me', () => {
//     it('returns the test string for quality hub core backend', async () => {
//       const server = app.createHttpServer({});
//       const response = await request(server)
//               .post('/')
//               .set({Authorization: token})
//               .send({
//                 query: 'query { me { first_name last_name } } '
//               });
//               console.log(response.body); 
//     //   expect(JSON.parse(response.text).data.me).toBe()
//     })
//   });
  
//   describe('login', () => {
//       it('should return an error if the user is not logged in', async () => {
//         const server = app.createHttpServer({});
//         const response = await request(server)
//                 .post('/')
//                 .send({
//                   query: `
//                   mutation { 
//                     login(email:"labs18.qualityhub@gmail.com", password: "welovequails18") 
//                     {
//                       token
//                     } 
//                   } 
//                   `
//                 });
//                 console.log(response.body.data.login);
//             })
//     });

// describe('user', () => {
//     it('returns the test string for quality hub core backend', async () => {
//       const server = app.createHttpServer({});
//       const response = await request(server)
//               .post('/')
//               .set({Authorization: token})
//               .send({
//                 query: 'query { users { first_name last_name } } '
//               });
//               console.log(response.body); 


//     //   expect(JSON.parse(response.text).data.me).toBe()
//     })
//   });


// describe('industries', () => {
//     it('returns the test string for quality hub core backend', async () => {
//       const server = app.createHttpServer({});
//       const response = await request(server)
//               .post('/')
//               .set({Authorization: token})
//               .send({
//                 query: 'query { industries{ name } } '
//               });
//               console.log(response.body); 

//     })
//   });


// describe('user', () => {
//     it('returns the test string for quality hub core backend', async () => {
//       const server = app.createHttpServer({});
//       const response = await request(server)
//               .post('/')
//               .set({Authorization: token})
//               .send({
//                 query: `query {
//                      user(id:"ck2pddqr100030766fg7560s8"){
//                          first_name 
//                      }
//                     } `
//               });
//               console.log(response.body); 
//     })

//   });

//   describe('signup', () => {
//           it('should return an error if the user is not logged in', async () => {
//             const server = app.createHttpServer({});
//             const response = await request(server)
//                     .post('/')
//                     // .set({Authorization:token})
//                     .send({
//                       query: `
//                       mutation { 
//                         signup(first_name: "nick", last_name: "quail", password:"quail", email:"qqquail@mail.com", city:"quail",state: "fl", industry:"ck2rzrd8m00270773ptf4j9oe"){
//                             token
//                         }
//                       } 
//                       `
//                     });
//                     console.log(response.body);
//                 })
//         });


  // describe('update', () => {
  //         it('should return an error if the user is not logged in', async () => {
  //           const server = app.createHttpServer({});
  //           const response = await request(server)
  //                   .post('/')
  //                   .set({Authorization:token})
  //                   .send({
  //                     query: `
  //                     mutation { 
  //                       update(first_name: "nicccck"){
  //                           id
  //                       }
  //                     } 
  //                     `
  //                   });
  //                   console.log(response.body);
  //               })
  //       });

  //  describe('delete', () => {
  //         it('should return a deleted user if succesful', async () => {
  //           const server = app.createHttpServer({});
  //           const response = await request(server)
  //           .post('/')
  //           .set({Authorization:token})
  //           .send({
  //             query: `
  //             mutation { 
  //               deleteUser {
  //                 first_name
  //                 last_name
  //                 id 
  //               }
  //             } 
  //             `
  //           });
  //           console.log(response.body);
  //           console.log(typeof response.body);

  //           expect(response.body.data).toBeTruthy()
  //         })
  //       });