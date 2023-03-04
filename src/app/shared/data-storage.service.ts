import { Injectable } from "@angular/core";
import { HttpClient, HttpClientModule, HttpParams } from "@angular/common/http";
import { Recipe } from "../recipes/recipe.model";
import { RecipeService } from "../recipes/recipe.service";
import { map, take, tap } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";
import { exhaustMap } from "rxjs/internal/operators/exhaustMap";

@Injectable({providedIn: 'root'})
export class DataStorageService{
    constructor(private http : HttpClient,
         private recipeService: RecipeService,
          private authService: AuthService
          ){}

    storedRecipes(){
        const recipes = this.recipeService.getRecipes();
        this.http
        .put('https://ng-complete-recipe-book-b96ba-default-rtdb.firebaseio.com/recipes.json',
         recipes
        )
         .subscribe(response =>{
            console.log(response); 
         });
    }

    fetchRecipes(){
       
        return this.http
        .get<Recipe []>('https://ng-complete-recipe-book-b96ba-default-rtdb.firebaseio.com/recipes.json')
        .pipe(map (recipes => {
            return recipes.map(recipe => {
                return {
                    ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] 
                };
            });
            }),tap(recipes => {
                this.recipeService.setRecipes(recipes);
            })
        )
    }

}