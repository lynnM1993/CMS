import home from "./views/home/home.vue";
import users from "./views/users/users.vue";
import cate from "./views/cate/cate.vue";
import uploads from "./views/uploads/uploads.vue";
import comment from "./views/comment/comment.vue";
import news from "./views/news/news.vue";
import note from "./views/note/note.vue";
import photo from "./views/photo/photo.vue";




const routes = [
	{path:"",component:home},
	{path:"/home",component:home},
	{path:"/users",component:users},
	{path:"/cate",component:cate},
	{path:"/uploads",component:uploads},
	{path:"/comment",component:comment},
	{path:"/news",component:news},
	{path:"/note",component:note},
	{path:"/photo",component:photo},
];
export default {
	routes
}