

    const BaseUrl  ="https://tarmeezacademy.com/api/v1"

    setUpUI()


    function toggleLoader(show = true)
    {
        if(show)
        {
            document.getElementById("loader").style.visibility = 'visible'
        }else {
            document.getElementById("loader").style.visibility = 'hidden'
        }
    }
    function loginBtnClicked(){

      const username = document.getElementById("username-input").value
      const password = document.getElementById("password-input").value
      const params = {
        "username" : username,
        "password" : password
      }
      axios.post(`${BaseUrl}/login`,params)
      .then((response)=>{
        localStorage.setItem("token",response.data.token)
        localStorage.setItem("user",JSON.stringify(response.data.user))
        const modal = document.getElementById("login-modal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        showAlert("Logged in successfully","success")
        setUpUI()
      }).catch((error)=>{
        const message = error.response.data.message
        showAlert(message,"danger")
      }).finally(()=>{
      })
    }
    
    function createNewPostClicked(){
      let postId = document.getElementById("post-id-input").value
      let isCreate = postId == null || postId == ""

      const title = document.getElementById("post-title-input").value
      const body = document.getElementById("post-body-input").value
      const image = document.getElementById("post-image-input").files[0]
      const token = localStorage.getItem("token")


      let formData = new FormData()
      formData.append("body", body)
      formData.append("title", title)
      formData.append("image", image)

      let url = ``
      const headers = {
        "Content-Type" :"multipart/form-data",
        "authorization" : `Bearer ${token}`
      }
      if (isCreate){
        url = `${BaseUrl}/posts`
      }else {
        formData.append("_method","put")
        url = `${BaseUrl}/posts/${postId}`
      }

      axios.post(url,formData,{
        headers: headers
      })
      .then((response)=>{
        const modal = document.getElementById("create-post-modal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        showAlert("New Post has Been Created","success")
        getPosts()
      }).catch((error)=>{
        const message = error.response.data.message
        showAlert(message,"danger")
      })
    }

    function registerBtnClicked(){
      const registerName = document.getElementById("register-name-input").value
      const registerUserName = document.getElementById("register-username-input").value
      const registerUserPassword = document.getElementById("register-password-input").value
      const image = document.getElementById("register-image-input").files[0]

      let formData = new FormData()
      formData.append("name", registerName)
      formData.append("username", registerUserName)
      formData.append("password", registerUserPassword)
      formData.append("image",image)


      const headers = {
        "Content-Type" :"multipart/form-data",
      }
      toggleLoader(true)
      axios.post(`${BaseUrl}/register`,formData,{
        headers: headers
      })
      .then((response)=>{
        console.log(response.data)
        localStorage.setItem("token",response.data.token)
        localStorage.setItem("user",JSON.stringify(response.data.user))
        const modal = document.getElementById("register-modal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        showAlert("New User Registered Successfully","success")
        setUpUI()
      }).catch((error)=>{
        const message = error.response.data.message
        showAlert(message,"danger")
      }).finally(()=>{
        toggleLoader(false)
      })
    }
    
    // <!-------- Login Success Alert ---------->
    function showAlert(customMessage,type){
      const alertPlaceholder = document.getElementById('success-alert')
        const appendAlert = (message, type) => {
          const wrapper = document.createElement('div')
          wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
          ].join('')
          alertPlaceholder.append(wrapper)
        }
            appendAlert(customMessage, type)
            setTimeout(()=>{
            const alertToHide = bootstrap.Alert.getOrCreateInstance('#success-alert')
            alertToHide.dispose()
            },2000)

            
    }
    
    
    function setUpUI(){
      const token = localStorage.getItem("token")
      const loginButton = document.getElementById("login-btn")
      const registerButton = document.getElementById("register-btn")
      //const logoutButton = document.getElementById("logout-btn")
      const addButton = document.getElementById("add-btn")
      
      const logOutDiv = document.getElementById("logout-Div")
      if (token == null) // ====> user is a guest (not logged in)
      {
        if (addButton != null){
            addButton.style.setProperty("display","none","important")
        }
        loginButton.style.setProperty("display","block","important")
        registerButton.style.setProperty("display","block","important")
        logOutDiv.style.setProperty("display","none","important")
      }else{
        if (addButton != null){
            addButton.style.setProperty("display","block","important")
        }
        loginButton.style.setProperty("display","none","important")
        registerButton.style.setProperty("display","none","important")
        logOutDiv.style.setProperty("display","block","important")
        const user = getCurrentUser()
        document.getElementById("nav-username").innerHTML = user.username
        document.getElementById("nav-user-image").src = user.profile_image
      }
    }

    function logout(){
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      showAlert("Logged out successfully","success")
      setUpUI()
    }
  

    // function getCurrentUSer is responsible for getting the logged in user
    function getCurrentUser(){
      let user = null
      const storageUser = localStorage.getItem("user")
      if (storageUser != null) {
        user = JSON.parse(storageUser)
      }
      return user
    }

    function editPostBtnClicked(postObject){
      let post = JSON.parse(decodeURIComponent(postObject))
      console.log(post)
      document.getElementById("post-modal-submit-button").innerHTML="Update"
      document.getElementById("post-id-input").value = post.id
      document.getElementById("post-modal-title").innerHTML="Edit Post"
      document.getElementById("post-title-input").value = post.title
      document.getElementById("post-body-input").value = post.body
     
      let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"),{})
      postModal.toggle()
     }
     
     
     
     function deletePostBtnClicked(postObject){
       let post = JSON.parse(decodeURIComponent(postObject))
       console.log(post)
       
       document.getElementById("delete-post-id-input").value = post.id
       let postModal = new bootstrap.Modal(document.getElementById("delete-post-modal"),{})
       postModal.toggle()
     }
     
     function confirmPostDelete(){
           const token = localStorage.getItem("token")
           const postId = document.getElementById("delete-post-id-input").value
           const headers = {
             "Content-Type" :"multipart/form-data",
             "authorization" : `Bearer ${token}`
           }
           axios.delete(`${BaseUrl}/posts/${postId}`,{
             headers : headers 
           })
     
     
           .then((response)=>{
             console.log(response)
             const modal = document.getElementById("delete-post-modal")
             const modalInstance = bootstrap.Modal.getInstance(modal)
             modalInstance.hide()
             showAlert("The Post has Been Deleteed successfully","success")
             getPosts()
     
            
           }).catch((error)=>{
             const message = error.response.data.message
             showAlert(message,"danger")
           })
     }
     function profileClicked(){
      const user = getCurrentUser()
      const userId = user.id
      window.location=`profile.html?userid=${userId}`
    }     