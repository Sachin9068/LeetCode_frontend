import { useForm } from 'react-hook-form';


function Signup(){

    const {register,handleSubmit,formState: { errors },} = useForm();

     return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>

      <input {...register('firstName')} placeholder='Enter First Name' />
      <input {...register('email')} placeholder='Enter Email Id'/>
      <input {...register('password',)} placeholder='Enter your Password' />
    
      <button type="submit">submit</button>
    </form>
  );
}




export default Signup


// function Signup(){

//     const [name,setName] = useState('');
//     const [email,setEmail] = useState('');
//     const [password,setPassword] = useState('');

//     const handlSubmit = (e)=>{
//           e.preventDefault();

//          console.log(name,email,password);
//     }

//     return (
//         <form onSubmit={handlSubmit} className="flex flex-col jus">
//             <input type="text" value={name} placeholder="Name" onChange={(e)=>setName(e.target.value)}></input>
//             <input type="text" value={email} placeholder="Email" onChange={(e)=>setEmail(e.target.value)}></input>
//             <input type="password" value={password} placeholder="password" onChange={(e)=>setPassword(e.target.value)}></input>

//             <button type="submit">Submit</button>
//         </form>
//     )
// }