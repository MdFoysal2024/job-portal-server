//step-01--------->

// npm install jsonwebtoken, npm install cookie-parser  এগুলো সাভার সাইটে ইনস্টাল করে index.js এর উপরে require('jsonwebtoken'); ও require('cookie-parser');  কনফিগার বসাতে হবে, এবং cookie-parser এর মিডেল ওয়ার সেট করতে হবে। এবং টোকেন রাখার জন্য verifyToken নামক ফাংশনাল মিডেল ওয়ার const verifyToken = (req, res, next)কে  সেট করতে হবে যার ভিতরে টোকেন থাকবে।


//const verifyToken = (req, res, next) => {
        //     console.log('Verify the JWT Token', req.cookies);
        // ----
        // -----
        // ------
// }





//step-02--------->

 //------->Have to Create a JWT API Documentation for Token------>

//--->Have to Create a JWT API Documentation for Token-->http://localhost:5000/jwt

//টোকেন নাম্বার ক্লাইন সাইট হতে সার্ভারে পাঠাতে app.post('/jwt', async (req, res)=>{
// }) অপারেশন চালাতে হবে। এবং 

// terminal এ node লিখে ইন্টার দিয়ে > require('crypto').randomBytes(64).toString('hex')--> লাইনটা লিখলে একটি সিক্রেট নাম্বার/টোকেন দিবে, ঐ টোকেন কে .env ফাইলে রেখে app.post() এর ভিতরের const token = jwt.sign() এর ভিতরে থাকা secret এর পরবির্তে (process.env.JWT_SECRET) সেট করতে হবে।





//step-03-------->
// verifyToken  কে কল করা ----->

// যেই app.get() অপারেশনের মাধ্যমে ক্লাইন্ট সাইটে ডাটা লোড করা হবে, 
// যেমন:--> app.get('/job-application', verifyToken, async (req, res) => {---})
//এই অপারেশনের verifyToken কে বসাতে হবে,  ক্লাইন্ট সাইটের  MyApplication পেইজ  কে  রিলোড দিলে verifyToken কল হবে এবং টোকেন চলে আসবে লগিন করে টোকেন তৈরী কারীর user email এবং ডাটা তৈরী কারী/ডাটা লোড কারীর user email যদি একই হয় তবে সে ঐ টোকেন দিয়ে পেইজ রিলোড দিলে ডাটা পাবে,আর এক না অথবা টোকেন এডিট করা হলে ডাটা না দিয়ে error message দিবে।


//(start------>
                // 1.-----> শুরুতে console.log(req.cookies) কে app.get()এর ভিতরে রেখে console.log('cook cook cookies is funny text ', req.cookies) এই লাইনের req.cookies থেকে টেষ্ট করার জন্য আমরা টোকেন ক্লাইন সাইটরে টোকেন টা পাই , এই লাইনের পরিবর্তে req.cookies/token কে verifyToken নামক middleware function  এর ভিতরে সেট করে সেই verifyToken কে app.get() অপারেশনের ভিতরে কল করা হয়েছ। app.get('/job-application', verifyToken, async (req, res) =>{}) যেখান থেকে ইউজার তার ডাটাকে ক্লাইন্ট সাইটে লোড করবে।

                // 2.-----> ক্লাইন সাইটের /MyApplication রাউটে ডাটা লোড করার সময় jwt এর প্রসেসিং চলে, যেখানে MyApplication রাউটের axios.get(api) তে {withCredentials:true} সেট করার পরে  MyApplication  রাউট/পেইজ রিলোড দিলে সার্ভারের verifyToken এর console.log(req.cookies) এ একটি টোকেন দিবে, যে টোকেন টি USER LOGIN এর সময় তৈরি হয়েছিলো browser>inspact>application>cookies  এর ভিতরে সেটাকে সার্ভারে পাঠাবে।

                // 3.----->লগিন করে টোকেন তৈরী কারীর user email এবং ডাটা তৈরী কারী/ডাটা লোড কারীর user email যদি একই হয় তবে সে ঐ টোকেন দিয়ে পেইজ রিলোড দিলে ডাটা পাবে,আর এক না অথবা টোকেন এডিট করা হলে ডাটা না দিয়ে error message দিবে।
                //-------->End) 





//------------------------ ক্লাইন সাইট------------------------>



//step-04--------->
//  Login পেইজে jwt এর কাজ সেটাপ----->

        // সার্ভারের app.post('/jwt', async (req, res)=>{}) অপারেশন এর সাপেক্ষে jwt এর কিছু কাজ axios.post() দিয়ে ক্লাইন সাইট এর লগিন পেইজে করা হইছে।
        // যেমন:

        //  axios.post('http://localhost:5000/jwt', user, { withCredentials: true })
                    //.then(res => {
        //     console.log(res.data);   //console.log(data.data)

        //  })

                // যেখান থেকে রিকুয়েস্ট পাঠাবে যাতে লগিন করার সাথে সাথে একটি টোকেন জেনারেট হবে, এবং টোকেনটি কে পরবর্তিতে নিচের step-05 দ্বারা সার্ভারে পাঠানো হয় । এবং jwt এর বেশ কিছু rules/functionality কে chatGPT থেকে নেয়া হয়েছে। 



//step-05--------->
// ক্লাইন সাইট এর ডাটা রিলোড পেইজে jwt এর কাজ সেটাপ----->

        //ক্লাইন সাইট এর একটি নির্দিষ্ট পেইজ/রাউট কে রিলোড দিয়ে সার্ভাার থেকে ডাটা আনার সাথে সাথে, ক্লাইন সাইট লগিন করার পরে যে টোকেন টা পাওয়া যায় তাকে সার্ভারে পাঠাতে ক্লাইন সাইট এর ঐ নির্দিষ্ট পেইজ/রাউটে ডাটা ফেচে এই লাইনটি দিতে হবে axios.get(`http://localhost:5000/job-application?email=${user.email}`,
        //  { withCredentials: true })
        // fetch পরিবর্তে axios.get() দিয়ে আরো সহজে ডাটা লোড করা যায়

        //ইমেইল ও টোকেন ঠিক থাকলে ডাটা আসবে না হরে ইরোর দিবে।








// -----------------------step-06--------------------------------->

// jwt token remove documentation‍ after logout-->

//-------------------------ক্লাইন্ট সাইট---------------->
//-------------


//------------------------সার্ভার  সাইট---------------->
//------------

   



// -----------------------step-07--------------------------------->


//-----------------ক্লাইন্ট সাইট------>custom hook(useAxiosSecure)---------->


        //লগিন করে টোকেন তৈরী কারীর user email এবং  ডাটা তৈরী কারীর user email 
        // যদি একই হয় তবে সে ঐ টোকেন দিয়ে পেইজ রিলোড দিলে ডাটা পাবে,
        // আর এক না হলে error message দিয়ে interceptors তাকে Log Out করে দিবে।












 //-----------------------নিচে 7 টি ধারেপ বিস্তারিত দেয়া হলো-------------------->


// -----------------------step-01--------------------------------->

// npm install jsonwebtoken, npm install cookie-parser  এগুলো ইনস্টাল করে উপরে require('jsonwebtoken'); ও require('cookie-parser');  কনফিগার বসাতে হবে, এবং cookie-parser এর মিডেল ওয়ার সেট করতে হবে।  এবং টোকেন রাখার জন্য verifyToken নামক ফাংশনাল মিডেল ওয়ার const verifyToken = (req, res, next)কে  সেট করতে হবে যার ভিতরে টোকেন থাকবে।


// npm install jsonwebtoken, npm install cookie-parser 


// const jwt = require('jsonwebtoken');
// const cookieParser = require('cookie-parser')


// app.use(cookieParser())
// app.use(cors({
//     origin: ['http://localhost:5173'],
//     credentials: true
// }));


//---->jwt এর ক্ষেত্রে cors এর ভিতরে ক্লাইন সাইট লোকাল হোস্ট url কে এখানে app.use(cors({origin: ['http://localhost:5173'], credentials: true})) এটা দিতে হবে অর্থ্যাৎ টোকেন তৈরীর জন্য এই http://localhost:5173 লিংক/url এর ক্লাইন্ট সাইট কে ACCESS/PERMIT দেয়া ।



// ---------------------verify Token middleware------------------------>

// ক্লাইন্ট সাইটের যে রাউটার/পেইজ কে রিলোড দিলে সার্ভার থেকে ডাটা লোড হবে ঐ পেইজের  app.get()  অপারেশনের ভিতরে প্রথমে 

// const verifyToken = (req, res, next) => {
//     //---> console.log('Verify the JWT Token', req.cookies);

//     //---> const token = req.cookies;
//     //--->  console.log(token)

//     const token = req?.cookies?.token;
//     console.log(token)


//     if (!token) {
//         return res.status(401).send({ message: 'Unauthorized Access' })
//     }


//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {

//         if (err) {
//             return res.status(401).send({ message: 'Unauthorized Access' })
//         }

//         req.user = decoded;
//         next();

//     })

// }




        //---------------------step-02----------------------------------->


        //JWT এর জন্য  Auth related APIs---->
        //------->Have to Create a JWT API for Token------>


        //---> টোকেন নাম্বার ক্লাইন সাইট হতে সার্ভারে পাঠাতে app.post() অপারেশন চালানো হয়।


        //---->user = req.body; এর মাধ্যমে JWT এর কিছু ডাটা/টোকেন ক্লাইন্ট সাইট হতে সার্ভারের  body তে পাঠানো হবে। এবং const token = jwt.sign(user, 'secret', { expiresIn: '1h' }) লাইনের মাধ্যমে বাকি কাজ গুলো করা হবে 
        // --->এখানে jwt.sign() এর ভিতরে  ৩টা বিষয় থাকে 
        //---> 1. user
        //---> 2.'secret'/token/process.env.JWT_SECRET
        //---> 3. expiresIn: '1h' এটা হলো টোকেন পাঠানোর একটা নির্দিষ্ট সময়


        //---> আর jwt.sign() এই লাইন টি google> chat GPT এর হেল্প নিয়ে করা হয়েছে



        //---> আর এই খানের বেশ কিছু লাইন chat GPT এর পাশাপাশি  google এর > jwt-->https://jwt.io/libraries?language=Node.js-->github View Repo থেকে আনা হয়েছে।

        //-----------সার্ভার সাইট/index.js থেকে সরাসরি কপি করে আনা হয়েছে--->


         //JWT এর জন্য  Auth related APIs---->
        //------->Have to Create a JWT API for Token------>

        //--------app.post() অপারেশন--------->


        // app.post('/jwt', async (req, res) => {
        //     const user = req.body;

        //     (//---->const token = jwt.sign(user, 'secret', { expiresIn: '1h' }))

        //     const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '1h' })
        //     res
        //        .cookie('token', token, {//-->.cookie এর বিষয় গুলো chatGPT থেকে আনা
        //            httpOnly: true,
        //            secure: false //-->http://localhost:5000/jwt>http এর পর s না
        //                            থাকায় এটি non-secure, তাই এর secure ভ্যলু false 

        //         })
        //         .send({ success: true })
        // })


        // terminal এ node লিখে ইন্টার দিয়ে > require('crypto').randomBytes(64).toString('hex') লাইনটা লিখলে একটি সিক্রেট নাম্বার/টোকেন দিবে, ঐ টোকেন কে .env ফাইলে রেখে এখানে secret এর পরবির্তে (process.env.JWT_SECRET) সেট করতে হবে।




//-------------------------------step-03-----------------------------------> 

          //-----------সার্ভার থেকে সরাসরি কপি করে আনা হয়েছে--->


        // app.get('/job-application', verifyToken, async (req, res) => {
        //     const email = req.query.email;
        //     const query = { application_email: email };


                //------>লগিন করে টোকেন তৈরী কারীর user email এবং  ডাটা তৈরী কারীর user email যদি একই হয় তবে সে ঐ টোকেন দিয়ে পেইজ রিলোড দিলে ডাটা পাবে,আর এক না হলে error message দিবে।

                // if (req.user.email !== req.query.email) {
                //     return res.status(403).send({ message: 'Forbidden Access' })
                //     }


                //----->console.log('cook cook cookies is funny text ', req.cookies)

                //(start------>
                // 1.-----> শুরুতে console.log(req.cookies) কে app.get()এর ভিতরে রেখে console.log('cook cook cookies is funny text ', req.cookies) এই লাইনের req.cookies থেকে টেষ্ট করার জন্য আমরা টোকেন ক্লাইন সাইটরে টোকেন টা পাই , এই লাইনের পরিবর্তে req.cookies/token কে verifyToken নামক middleware function  এর ভিতরে সেট করে সেই verifyToken কে app.get() অপারেশনের ভিতরে কল করা হয়েছ। app.get('/job-application', verifyToken, async (req, res) =>{}) যেখান থেকে ইউজার তার ডাটাকে ক্লাইন্ট সাইটে লোড করবে।

                // 2.-----> ক্লাইন সাইটের /MyApplication রাউটে ডাটা লোড করার সময় jwt এর প্রসেসিং চলে, যেখানে MyApplication রাউটের axios.get(api) তে {withCredentials:true} সেট করার পরে  MyApplication  রাউট/পেইজ রিলোড দিলে সার্ভারের verifyToken এর console.log(req.cookies) এ একটি টোকেন দিবে, যে টোকেন টি USER LOGIN এর সময় তৈরি হয়েছিলো browser>inspact>application>cookies  এর ভিতরে সেটাকে সার্ভারে পাঠাবে।

                // 3.----->লগিন করে টোকেন তৈরী কারীর user email এবং ডাটা তৈরী কারী/ডাটা লোড কারীর user email যদি একই হয় তবে সে ঐ টোকেন দিয়ে পেইজ রিলোড দিলে ডাটা পাবে,আর এক না অথবা টোকেন এডিট করা হলে ডাটা না দিয়ে error message দিবে।
                //-------->End) 





                //     const result = await jobsApplicationCollection.find(query).toArray();

                //   (  //--->result এর ভিতরে for loop চালিয়ে প্রতিটি Application এর আইডি বের করা হলো -----।)


                //     for (const application of result) {
                //         console.log(application.job_id);
                //         const jobQuery = { _id: new ObjectId(application.job_id) }
                //         const jobResult = await jobsCollection.findOne(jobQuery)

                //         (---//--->jobResult এর ভিতরে নিচের ইনফোরমেশন গুলো সেট করা/পাঠানো হয়েছে।----)

                //         if (jobResult) {
                //             application.title = jobResult.title;
                //             application.company = jobResult.company;
                //             application.company_logo = jobResult.company_logo;
                //             application.location = jobResult.location;
                //         }
                //     }


                //     res.send(result)
                // })




//-------------------------------- ক্লাইন সাইট------------------------------->




//---------------------------------step-04-------------------------------------->



        //  এবং jwt এর কিছু কাজ axios.post() দিয়ে ক্লাইন সাইট এর লগিন পেইজে করা হইছে। যেখান থেকে রিকুয়েস্ট পাঠাবে যাতে লগিনের পরে একটি টোকেন জেনারেট করে । এবং jwt এর বেশ কিছু rules/functionality কে chatGPT থেকে নেয়া হয়েছে। 



                //JWT এর জন্য Auth related APIs fetching by axios.post ---->

                //jwt এর কিছু কাজ axios.post() দিয়ে ক্লাইন সাইট এর লগিন পেইজে করা হইছে। যেখান থেকে রিকুয়েস্ট পাঠাবে যাতে লগিন করার সাথে সাথে একটি টোকেন জেনারেট হবে, এবং টোকেনটি কে পরবর্তিতে নিচের step-05 দ্বারা সার্ভারে পাঠানো হয় । এবং jwt এর বেশ কিছু rules/functionality কে chatGPT থেকে নেয়া হয়েছে। 


            //-----------ক্লাইন সাইট  থেকে সরাসরি কপি করে আনা হয়েছে------->

            //------>npm install axios  করে নিতে হবে।


            //-----------> jwt token create documentation only login page-->

                // axios.post('http://localhost:5000/jwt', user, { withCredentials: true })
                //     //----> .then(data => {
                //     //---->     console.log(data);  //console.log(data.data)
                //     // })----------> এটার পরিবর্তে নিচের লাইন

                //     .then(res => {
                //         console.log(res.data);   //console.log(data.data)
                //     })



//-----------> jwt token create documentation for all login/register/socialLogin/googleLogin -->


              // AuthProvider এর useEffect() থেকে jwt API ডকুমেন্টেশন সেট করলে login/register/socialLogin/googleLogin যে কোনো জায়গা থেকে user email পেলেই সার্ভারে টোকেন পাঠাবে । আর  login/register এ ডকুমেন্টেশন সেট করলে সব জায়গা থেকে টোকেন পাঠাতে পারবে না , 

              //else এর ভিতরে থাকা এই (jwt token remove documentation) অংশের দ্বারা লগ আউটরে সাথে সাথে ব্রাউজার হতে টোকেন ডিলিট হয়ে  যাবে। 


             //-->  if (currentUser?.email) {

                 //         const user = { email: currentUser.email }

                 //         //-----------> jwt token create documentation-->

                 //         axios.post('http://localhost:5000/jwt', user, {
                 //               withCredentials: true })
                 //             .then(res => {
                 //                 console.log('Login Create Token', res.data);
                 //                 setLoading(false);
                 //             })
             //      }

             //-->    else {

                 //         //---> jwt token remove documentation ‍after logout--->

                 //         axios.post('http://localhost:5000/logout', {}, {
                 //             withCredentials: true
                 //         })
                 //             .then(res => {
                 //                 console.log('Log Out Remove Token', res.data);
                 //                 setLoading(false);
                 //             })
                 //     }









        //-------------------------------step-05----------------------------------->

        //ক্লাইন সাইট এর একটি নির্দিষ্ট  যেমন: MyApplication পেইজ/রাউট কে রিলোড দিয়ে সার্ভাার থেকে ডাটা আনার সাথে সাথে, ক্লাইন সাইট লগিন করার পরে যে টোকেন টা পাওয়া যায় তাকে সার্ভারে পাঠাতে ক্লাইন সাইট এর ঐ নির্দিষ্ট পেইজ/রাউটে ডাটা ফেচে এই লাইনটি দিতে হবে axios.get(`http://localhost:5000/job-application?email=${user.email}`,
        //  { withCredentials: true })
        // fetch পরিবর্তে axios.get() দিয়ে আরো সহজে ডাটা লোড করা যায়



        //-----------ক্লাইন সাইট থেকে সরাসরি কপি করে আনা হয়েছে--->

         //fetch পরিবর্তে axios.get() দিয়ে আরো সহজে ডাটা লোড করা যায়, এবং axios.get() হলো আপডেট ভার্সন , fetch এর console.log(data)/console.log(setJobs(data))  পরিবর্তে  axios এর console.log(data.data)/console.log(setJobs(res.data)) হবে আর .then() একবার লেখলেই হবে।

        //  axios.get(`http://localhost:5000/job-application?email=${user.email}`, { withCredentials: true })
        //  .then(res => {
        //      console.log(setJobs(res.data))
        //  })





        // -----------------------step-06--------------------------------->

         //else এর ভিতরে থাকা এই (jwt token remove documentation) অংশের দ্বারা লগ আউটরে সাথে সাথে ব্রাউজার হতে টোকেন ডিলিট হয়ে যাবে। 

         // ক্লাইন্ট সাইট AuthProvider এর useEffect এর ভিতর থেকে নেয়া হয়েছে। 

             //-------------------------ক্লাইন্ট সাইট---------------->

        //else {
                     //---> jwt token remove documentation ‍after logout--->

            //         axios.post('http://localhost:5000/logout', {}, {
            //             withCredentials: true
            //         })
            //             .then(res => {
            //                 console.log('Log Out Remove Token', res.data);
            //                 setLoading(false);
            //             })


       //      }



//---------------------------------সার্ভার  সাইট--------------------------->

                  //-----> jwt token remove documentation‍ after logout-->



                 //    app.post('/logout', (req, res) => {
                 //        res
                 //            .clearCookie('token', {
                 //                httpOnly: true,
                 //                secure: false
                 //            })
                 //            .send({ success: true })
                 //    })











        // -----------------------step-07--------------------------------->

         
             //-------------------------ক্লাইন্ট সাইট custom hook---------------->




                //  const { signOutUser } = useAuth();   //used ----> custom hook
                //  const navigate = useNavigate();
             
             


        
                 //লগিন করে টোকেন তৈরী কারীর user email এবং  ডাটা তৈরী কারীর user email 
                 // যদি একই হয় তবে সে ঐ টোকেন দিয়ে পেইজ রিলোড দিলে ডাটা পাবে,
                 // আর এক না হলে error message দিয়ে interceptors তাকে Log Out করে দিবে।
             


         // Documentation টি https://axios-http.com/docs/interceptors সাইট থেকে নেয়া।


                //  useEffect(() => {
             
                //      axiosInstance.interceptors.response.use(response => {
                //          return response;
                //      }, error => {
                //          console.log('Error Caught in interceptor', error);
             
                //          if (error.status === 401 || error.status === 403) {
                //              console.log('Log Out the User');
             
             
                             // user logout documentation-------->
             
                //              signOutUser()
                //                  .then(() => {
                //                      console.log('successfully signout')
                //                      navigate('/signIn')
             
             
                //                  })
                //                  .catch(error => {
                //                      console.log('Sign out failed', error)
                //                  })
             
                //          }
             
                //          return Promise.reject(error);
                //      })
             
                //  }, [])
             