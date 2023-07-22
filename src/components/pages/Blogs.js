    import React,{useEffect,useState, useRef} from 'react'
    //import{useRef,useEffect}from"react";
    import {Link} from 'react-router-dom';
    import './blog.css'
    import {db, storage} from './firebase-config.js';
    import { ref, uploadBytes, listAll, getDownloadURL,deleteObject } from 'firebase/storage'
    import { v4 } from 'uuid'
    import {collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where, orderBy, serverTimestamp, getDocs} from 'firebase/firestore'

    export default function Blogs() {
      const refHeader = useRef()
      const refInput = useRef()
      const refSummary = useRef();
      const refTextarea = useRef()
      const cont = useRef()
      const refDiv = useRef(null);
      const SelectOption = useRef();
      const imagelistRef = ref(storage, 'images/')

    const [blogs,setBlogs] = useState([]);
    const [newTitle,setNewTitle] = useState('');
    const [newSummary,setNewSummary] = useState('');
    const [newContent,setNewContent] = useState('');
    const [editingBlog,setEditingBlog] = useState(null);
    const [imageUpload, setImageUpload] = useState(null);
    const [optionValue, setOptionValue] = useState('');
    const [bgImage, setBgImage] = useState();
    const [dUrl, setDUrl] = useState('');
    const [TitleEdit, setTitleEdit] = useState('');
    const [SummaryEdit, setSummaryEdit] = useState('');
    const [ContentEdit, setContentEdit] = useState('');
    const [editTitle, setEditTitle] = useState('');
    const [Ushering, setUshering] = useState('')
    const [imageList, setImageList] = useState([]);
    const [storeTitleValue, setStoreTitleValue] = useState('')

    // alert('1. You have to wait a while before the image is uploaded after 15 or more seconds reload the page ')
    // const style = `background-image: url(${dUrl})`
      // const style = {
      // }
      const downURL = dUrl;
      const imageActuallistRef = ref(storage, downURL)
       
    useEffect(()=>{
    const unsubscribe = onSnapshot(query(collection(db,'blogs')), orderBy('createdAt'), snapshot => {
    const blogs = snapshot.docs.map(doc=>({
    id:doc.id,
    ...doc.data()
    }));
    setBlogs(blogs);
  });
  return () => unsubscribe();
},[]);
      const handleSelectChange = (event) => {
        setOptionValue(event.target.value);
      }
      function captureCategory(category) {
        const colRef = collection(db, 'blogs');
        const queryRef = query(colRef, where("Category", "==", category), orderBy('createdAt'));
      
        const categoryNames = {
          Evangelism: "sorry, this is empty",
          Ushering: "sorry this is empty"
        };
      
        getDocs(queryRef).then(snapshot => {
          console.log(snapshot.docs.length);
          if (categoryNames[category]) {
            setUshering(categoryNames[category]);
          } else if (category === "Ushering" && snapshot.docs.length === 0) {
            console.log('empty');
            cont.current.innerHTML = categoryNames[category];
          }
        });
      
        const unsubscribe = onSnapshot(queryRef, snapshot => {
          const blogs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setBlogs(blogs);
        });
      
        return () => unsubscribe();
      }
      
      function captureAll() {
        const colRef = collection(db, 'blogs');
        const queryRef = query(colRef);
      
        console.log(queryRef);
      
        const unsubscribe = onSnapshot(queryRef, orderBy('createdAt'), snapshot => {
          const blogs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setBlogs(blogs);
        });
      
        return () => unsubscribe();
      }
         
function load() {
// listAll(imagelistRef).then((res) => {
//       res.items.forEach((item) => {
//         getDownloadURL(item).then((url) => {
//           setImageList((prev) => [...prev, url])
//           console.log(url)
//           setDUrl(url)
//         })
//       })
    // })
  }
useEffect(() => {
  const imagelistRef = ref(storage, 'images/');
  listAll(imagelistRef).then((res) => {
    res.items.forEach((item) => {
      getDownloadURL(item).then((url) => {
        setImageList((prev) => [...prev, url])
        // console.log(url)
        setDUrl(url)
      })
    })
  })
}, []);
        // imageList.map(url => {
      // })
        useEffect(() => {
            listAll(imagelistRef).then((res) => {
                // console.log(res)
            })
        }, [imagelistRef])
       
    //click to call the pop up form on the first page
    function addblog( Title, Summary, Content) {
      const popup_box = document.querySelector('.pop-up_box');
      popup_box.classList.add('show'); 
      setTitleEdit(Title)
      setSummaryEdit(Summary)
      setContentEdit(Content)
    }
    useEffect(()=> {
      refInput.current.value = TitleEdit;
      refSummary.current.value = SummaryEdit;
      refTextarea.current.value = ContentEdit;
      // console.log(refInput.current.value)
    }, [TitleEdit, SummaryEdit, ContentEdit])
    //remove pop up form
    function removeblog() {
      const popup_box = document.querySelector('.pop-up_box');
      popup_box.classList.remove('show');
    }
    const createBlog = async() => {
    await addDoc(collection(db,'blogs'),{
    Title:newTitle,
    Summary:newSummary,
    Content:newContent,
    Category: optionValue,
    createdAt: serverTimestamp()
    // ImageUrl: dUrl
    });
    setNewTitle('');
    setNewSummary('');
    setNewContent('');
    removeblog();
    };
function setValue(id,Title,Summary,Content) {

}

    const updateBlog = async(id,Title,Summary,Content)=>{
    await updateDoc(doc(db,'blogs',id),{
      Title: TitleEdit,
    Summary: SummaryEdit,
    Content: ContentEdit
    });
    // refInput.current.value = refHeader.current.value
    // console.log(refHeader.current.value)
    setEditingBlog(null);
    removeblog();
    };
    const deleteBlog =async(id, img)=>{
    const blogRef=doc(db,'blogs',id);
    await deleteDoc(blogRef);
    deleteObject(ref(storage, img)).then(() => {
      alert('File deleted successfully')
    }).catch((error) => {
      alert('Uh-oh, an error occurred!', error)
    });
    };
    const upload = () => {
      if(imageUpload == null) return;
      const imgRef = ref(storage, `images/${imageUpload.name + v4()}`);
      uploadBytes(imgRef, imageUpload).then(() => {
        alert('Image uploaded Succesfully')
      });
    }
      useEffect(() => {
        const getImageUrls = async () => {
          const urls = await Promise.all(
            blogs.map((post) => getDownloadURL(post.imageUrl))
          );
          setImageList(urls);
        };
        getImageUrls();
      }, [blogs]);
    return (
    <div className="blogs-page">
    <header>
    <h1>Blogs</h1>
    </header>
    <div className='categories-container'>
    <div className='categories'>
              <div className='cat Hospitality' onClick={captureCategory("Hospitality")}>
                <h6>  Hospitality</h6>
              </div>
              <div className='cat Security' onClick={captureCategory("Security")}>
                <h6>  Security</h6>
              </div>
              <div className='cat Protocol' onClick={captureCategory("Protocol")}>
                <h6>  Protocol</h6>
              </div>
              <div className='cat Sanctuary' onClick={captureCategory("Sanctuary")}>
                <h6>  Sanctuary</h6>
              </div>
              <div className='cat Media' onClick={captureCategory("Media")}>
                <h6> Media </h6>
              </div>
              <div className='cat Choir' onClick={captureCategory("Choir")}>
                <h6>  Choir </h6>
              </div>
              <div className='cat Evangelism' onClick={captureCategory("Evangelism")}>
                <h6>  Evangelism </h6>
              </div>
              <div className='cat Ushering' onClick={captureCategory("Ushering")}>
                <h6>  Ushering </h6>
              </div>
              <div className='cat All' onClick={captureAll}>
                <h6>  All </h6>
              </div>
            </div>

      <button className='add' onClick={addblog}>Add Blog</button>
    </div>
      {/* <button onClick={load}> Load </button> */}
    <main>
    {editingBlog ? (
    <>
          <div className='pop-up_box'>
            <div className='pop-up'>
              <div className='content'>
              <header>
                  <p> Edit Your Blog</p>
                  <i className='fas fa-times' onClick={  () => {
      setEditingBlog(null)
      removeblog()
    }
    } ></i>
                </header>
    <div className='form-blog-container'>
    <input
    ref={refInput}
    type="text"
    placeholder='Title'
    value={TitleEdit}
    onChange={e=>setTitleEdit(e.target.value)}
    />
    <input
    ref={refSummary}
    type="text"
    placeholder='Summary'
    value={SummaryEdit}
    onChange={e=>setSummaryEdit(e.target.value)}
    />
    <textarea
    ref={refTextarea}
    placeholder='Content'
    value={ContentEdit}
    onChange={e=>setContentEdit(e.target.value)}
    />
                  <br />
    <button onClick={()=>updateBlog(editingBlog.id,newTitle,newSummary,newContent)} className='add_blog'
    > Edit Blog
    </button>
    <button onClick={ ()  =>  {
      setEditingBlog(null)
      upload()
      load()
    }
    } className='cancelBtn'> Cancel</button>
    </div>
    </div>
    </div>
    </div>
    </>
    ) : (
    <>
    <div className='pop-up_box'>
            <div className='pop-up'>
              <div className='content'>
              <header>
                  <p> Add a New Blog</p>
                  <i className='fas fa-times' onClick={removeblog}></i>
                </header>
    <div className='form-blog-container'>
    <input
    ref={refInput}
    type="text"
    placeholder='Title'
    value={newTitle}
    onChange={e=>setNewTitle(e.target.value)}
    />
    <input
    ref={refSummary}
    type="text"
    placeholder='Summary'
    value={newSummary}
    onChange={e=>setNewSummary(e.target.value)}
    />
    <textarea
    ref={refTextarea}
    placeholder='Content'
    value={newContent}
    onChange={e=>setNewContent(e.target.value)}
    />
    <br />
                  <label for="background_img"> Choose an image as your background:  </label>
                  <input 
                  type="file" 
                  accept=".png, .jpg, .jpeg" 
                  onChange={(event) => {
                    setImageUpload(event.target.files[0]);
                  }}
                  required />
                  {/* <button onClick={upload}>Upload</button> */}
                  <br />
                  <label for='church_cartegories'> Choose your category: </label>
                  <select name="church_cartegories" id="church_cartegories" ref={SelectOption} onChange={handleSelectChange}>
                    <option value="Hospitality"> Hospitality </option>
                    <option value="Security"> Security </option>
                    <option value="Protocol"> Protocol </option>
                    <option value="Sanctuary"> Sanctuary </option>
                    <option value="Media"> Media </option>
                    <option value="Choir"> Choir </option>
                    <option value="Evangelism"> Evangelism </option>
                    <option value="Ushering"> Ushering </option>
                  </select>

    <button onClick={ () => {
      createBlog()
      upload()
      }} className='add_blog'>AddBlog</button>
    </div>
    </div>
    </div>
    </div>
    </>
    )}
    <div className="blogs-container" ref={cont}>
    {blogs.map ((blog, index) => (
       
      //  imageList.map ((url) => (
        
        <div key={blog.id} className="blog-post" ref={refDiv} style={{
          backgroundImage: `url(${imageList[index]})`,
          border: '1px solid black',
          borderRadius: '20px',
          width: '300px',
          height: '300px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: '1rem',
          /* background-image:linear-gradient(rgba(0, 0, 0, 0.432), rgba(0, 5, 5, 0.7)),
           url('../../../public/images/church5.jpg'); */
          backgroundPosition:'unset' ,
          backgroundSize:'cover' ,
          backgroundRepeat: 'no-repeat'
        }}>
    
        <h1 ref={refHeader}>{blog.Title}</h1>
    <p>{blog.Summary}</p>
    <div className="blog-post-actions">
    <button onClick = {  () => {
      setEditingBlog(blog)
      addblog(blog.Title, blog.Summary, blog.Content)
    }
    } 
    className='edit'> 
    <i className='fa-solid fa-pen-to-square edit'> <span> Edit </span>
    </i> </button>
    <button onClick={()=>deleteBlog(blog.id, imageList[index])}> 
    <i className='fa-solid fa-trash delete'> <span> Delete </span> </i></button>
    </div>
    <div className='flex'>
    <button className='btn-blog' onClick={blog.id}>
    <Link to ={`/Blogs/${blog.id}`} className='link'>
                            Read More
    </Link>
    </button>
    <p>{blog.Category}</p>
     </div>
    </div>
    // ))

    ))}
    </div>
    </main>
    </div>
    )
    }