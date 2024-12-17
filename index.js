const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
require('dotenv').config()
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;




//start-------middleware------------------>
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());


const logger = (req, res, next) => {
    console.log('Inside the Logger');
    next();
}

const verifyToken = (req, res, next) => {
    console.log('Verify the JWT Token', req.cookies);

    // const token = req.cookies;
    // console.log(token)

    const token = req?.cookies?.token;
    console.log(token, 'foysal')


    if (!token) {
        return res.status(401).send({ message: 'Unauthorized Access' })
    }


    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {

        if (err) {
            return res.status(401).send({ message: 'Unauthorized Access' })
        }

        req.user = decoded;   //লগিন করে টোকেন তৈরী কারীর user email টাই decoded এর req.user এর ভিতরে থাকা email  
        next();

    })

}

//End---------middleware------------------>


//DB_USER= job_hunter
//DB_PASS= DpwQhESIRauqTPCd

// console.log(process.env.DB_USER)
// console.log(process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vo2j9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();


        //Job related API
        const jobsCollection = client.db('jobPortal').collection('jobs');

        //Job application API
        const jobsApplicationCollection = client.db('jobPortal').collection('jobs_applications');




        //JWT documentation start-------->

        //JWT এর জন্য  Auth related APIs---->
        //---------------->Have to Create a JWT API for Token--------------->

        //user = req.body; এর মাধ্যমে JWT এর কিছু ডাটা ক্লাইন্ট সাইট হতে body তে পাঠানো হবে। এবং  const token = jwt.sign(user, 'secret', { expiresIn: '1h' }) লাইনের মাধ্যমে বাকি কাজ গুলো করা হবে । আর এই লাইন টি google> jwt-->https://jwt.io/libraries?language=Node.js-->View Repo



        //------->Have to Create a JWT API Documentation for Token------>

        app.post('/jwt', async (req, res) => {
            const user = req.body;
            //const token = jwt.sign(user, 'secret', { expiresIn: '1h' })
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
            res
                .cookie('token', token, { //.cookie এর বিষয় গুলো chatGPT থেকে আনা
                    //টোকেন নাম ='token', টোকেন ভেল্যু = token,

                    httpOnly: true,
                    secure: false 
                    //http://localhost:5000/jwt--> http এর পর s না থাকা এটি non-secure, তাই এর secure ভ্যলু false 

                })
                .send({ success: true }) //টোকেন জেনারেট হওয়াতে--->success: true 
        })
        // terminal এ node লিখে ইন্টার দিয়ে > require('crypto').randomBytes(64).toString('hex') লাইনটা লিখলে একটি সিক্রেট নাম্বার/টোকেন দিবে, ঐ টোকেন কে .env ফাইলে রেখে এখানে secret এর পরবির্তে (process.env.ACCESS_TOKEN_SECRET) সেট করতে হবে।
        // npm install jsonwebtoken, npm install cookie-parser  এগুলো ইনস্টাল করে উপরে require('jsonwebtoken'); ও require('cookie-parser');  কনফিগার বসাতে হবে, এবং cookie-parser এর মিডেল ওয়ার সেট করতে হবে।

        // এবং jwt এর ক্ষেত্রে cors এর ভিতরে ক্লাইন সাইট লোকাল হোস্ট url কে এখানে app.use(cors({origin: ['http://localhost:5173'], credentials: true})) এটা দিতে হবে। এবং jwt এর কিছু কাজ axios.post() দিয়ে ক্লাইন সাইট এর লগিন পেইজে করা হইছে। েযেখান থেকে রিকুয়েস্ট পাঠাবে যাতে লগিনের পরে একটি টোকেন জেনারেট করে । এবং jwt এর বেশ কিছু rules/functionality কে chatGPT থেকে নেয়া হয়েছে। 


        // jwt token remove documentation‍ after logout-->

        app.post('/logout', (req, res) => {
            res
                .clearCookie('token', {
                    httpOnly: true,
                    secure: false
                })
                .send({ success: true })
        })


        //JWT documentation end-------->










        // client সাইড থেকে কোনো ডাটা না পাঠিয়ে, ডাটা বেজে থাকা ইনসার্ট ডাটা গুলো client সাইডে আনার প্রক্রিয়া।  
        //app.get/ডাটা আনা--->  all data by main url-------->jobsCollection.find(); and toArray()

        //jobs related apis

        //পূর্বেই সেট/ইনসার্ট করে রাখা জব ডকুমেন্টস/চাকুরীর বিঙ্গাপন গুলো ক্লাইন্ট সাইট পেতে   
        app.get('/jobs', logger, async (req, res) => {
            const cursor = jobsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })







        //step-01--->app.post-----> সার্ভারে ডাটা পাঠাতে 

        //নতুন করে ক্লাইন্ট সাইট থেকে আরো জব ডকুমেন্টস/চাকুরীর বিঙ্গাপন সার্ভারে পাঠাতে/পোষ্ট/add করতে 
        // app.post এর ব্যবহার করা হয়েছে।
        app.post('/jobs', async (req, res) => {
            const newJob = req.body;
            const result = await jobsCollection.insertOne(newJob)
            res.send(result);
        })



        //step-02--->app.get-----> সার্ভার থেকে ডাটা আনতে

        // নতুন করে ক্লাইন্ট সাইট থেকে আরো জব ডকুমেন্টস/চাকুরীর বিঙ্গাপন সার্ভারে পোষ্ট/add করার পরে 
        // ঐ জব ডকুমেন্টস/চাকুরীর বিঙ্গাপন গুলো যার email দিয়ে পোষ্ট করা হয়েছে, সেই email এর মাধ্যমে
        // ঐ জব ডকুমেন্টস গুলোকে ক্লাইন্ট সাইট এর /myPostedJob রাউটে নিয়ে আসতে app.get এর ব্যবহার।

        app.get('/myPostedJob', async (req, res) => {
            const email = req.query.email;
            let query = {};
            if (email) {
                query = { hr_email: email }
            }

            const cursor = jobsCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        })





        //------>id দিয়ে যখন কোনো কিছুর Details দেখানো হবে।
        //app.get/ডাটা আনা---> single data by id-------->ObjectId(id) and jobsCollection.findOne()
        app.get('/jobDetails/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await jobsCollection.findOne(query)
            res.send(result);

        })





        //Job application API
        //app.post/ডাটা পাঠানো --->
        app.post('/job-applications', async (req, res) => {
            const application = req.body;
            const result = await jobsApplicationCollection.insertOne(application);
            res.send(result)
        })

        // ইমেইল দিয়ে app.get/ডাটা আনা-->  একজন ইউজারের একটা ইমেল দিয়ে পাঠানো সমস্ত ডাটা পাওয়ার উপায়।

        app.get('/job-application', verifyToken, async (req, res) => {
            const email = req.query.email;
            const query = { application_email: email };

            //লগিন করে টোকেন তৈরী কারীর user email এবং  ডাটা তৈরী কারীর user email যদি একই হয় তবে সে ঐ টোকেন দিয়ে পেইজ রিলোড দিলে ডাটা পাবে,আর এক না হলে error message দিবে।

            //লগিন করে টোকেন তৈরী কারীর user email !== ডাটা তৈরী কারীর user email 
            if (req.user.email !== req.query.email) {
                return res.status(403).send({ message: 'Forbidden Access' })
            }

            //ক্লাইন সাইটের /job-application রাউটে ডাটা লোড করার সময় jwt এর প্রসেসিং চলে যেখানে job-application রাউটের axios.get(api) তে {withCredentials:true} সেট করার পরে  job-application রাউট/পেইজ রিলোড দিলে সার্ভারের console.log(req.cookies) এ একটি টোকেন দিবে, যে টোকেন টি USER LOGIN এর সময় তৈরি হয়েছিলো browser>inspact>application>cookies  এর ভিতরে সেটাকে সার্ভারে পাঠাবে। 


            //console.log('cook cook cookies is funny text ', req.cookies) 
            // এই লাইনের পরিবর্তে req.cookies/token কে verifyToken নামক middleware function  এর ভিতরে সেট করে সেই verifyToken কে app.get অপারেশনের ভিতরে কল করা হয়েছে

            const result = await jobsApplicationCollection.find(query).toArray();

            //result এর ভিতরে for loop চালিয়ে প্রতিটি Application এর আইডি বের করা হলো ।
            for (const application of result) {
                console.log(application.job_id);
                const jobQuery = { _id: new ObjectId(application.job_id) }
                const jobResult = await jobsCollection.findOne(jobQuery)

                //jobResult এর ভিতরে নিচের ইনফোরমেশন গুলো সেট করা/পাঠানো হয়েছে।

                if (jobResult) {
                    application.title = jobResult.title;
                    application.company = jobResult.company;
                    application.company_logo = jobResult.company_logo;
                    application.location = jobResult.location;
                }
            }


            res.send(result)
        })













































































        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

































app.get('/', (req, res) => {
    res.send('Job portal is coming soon......!')
})

app.listen(port, () => {
    console.log(`Job portal server is running on port:${port}`)
})

