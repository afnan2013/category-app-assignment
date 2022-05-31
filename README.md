# category-app-assignment
Developing CRUD Rest Api for categories 

#Mandatory Tasks:
1. Create a database model for categories which can have nesting up to 4 levels of
child categories. Each category can have only one parent category. All category
names must be unique. Example:
Electronics>Accessories>Wearable Accessories>Smart Watch
Electronics>Appliances>Home Appliances>Television
2. Create a simple CRUD operation for these categories and expose that via a
GraphQL or REST API.
3. When a user searches for a category the parent category (if there is any) must be
provided in a single response.
4. If the user deactivates a category then all corresponding child categories must be
deactivated automatically.

#Bonus Tasks:
1. Complete the above tasks but for nesting of unlimited levels of child categories.
2. Use Redis to cache data to quickly serve further queries to the API. Clear the cache
if the actual data is modified.
3. Bonus points if you make a GraphQL API.

#Technology Stack:
1. NodeJS
2. MongoDB
3. Typescript
4. HapiJS/ExpressJS
5. GraphQL/REST
6. Redis
7. Git (for version control and code sharing)
8. README.md file for basic deployment documentation
