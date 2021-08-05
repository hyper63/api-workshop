<h1 align="center">API Workshop</h1>
<p align="center">In this workshop, we will walk through the process of designing a REST API</p>

---

## Table of Contents

- [About](#about)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [OpenAPI Editor](#openapi-editor)
- [Sequence Diagrams](#sequence-diagrams)
- [Data Validation](#data-validation)
- [Integration Tests](#integration-tests)
- [Securing the API](#securing-the-api)
- [README](#readme)
- [CI/CD](#ci/cd)
- [Summary](#summary)

---

What to expect?

The goals of this workshop is not to create a fully working API, API Design takes time and practice, the purpose of this workshop is to provide you a mental framework that you can use, refine, modify, make your own to work through the process of designing APIs for applications. At the end of our three hours, you will know the steps I take when working through the design process of application development, and I believe it will provide you a good starter guide to building applications.

## About

What will I learn from this workshop?

* How to design apps with an API First mindset?
* How to draw your api workflows for group sharing and feedback sessions?
* How to leverage REST documentation tools to identify holes in your design quickly?
* How to approach testing and continuous integration?
* Building a solid README for your future self and team 

## Prerequisites

What should I know, to get the most out of this workshop?

* Javascript
* Git/Github (you will need a github account)
* REST/JSON
* NodeJS
* ExpressJS

> NOTE: sign in with github to get a hyper dev environment https://dashboard.hyper63.com


## Getting Started

The project is a movie review app, with this app, the user will be able to write reviews of
their favorite movies and guests will be able to react to the review with a positive reaction or a negative reaction. The business logic, services and frontend components are already completed, all we have to do is complete the API.

1. Generate repository from this [template](https://github.com/hyper63/api-workshop/generate)

1. Launch env using gitpod 

Click the button below to start a new development environment:

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/from-referrer/)

1. Create a `.env` file and add your hyper connect string to the file

```
HYPER=hyperio://key:secret@host/app
```

## What is an API?

When you think about it, an API is a way to black box functionality so that the consumer can invoke that 
functionality in a declarative way, at least one level up from the previous level of abstraction. This allows the development team that will be consuming the API to focus at satisfying user features at a higher and more efficient level. 

## Thinking about application design and architecture

Understanding the functional requirements of any application is a must in order to design and architect your application. The functional requirements will help shape the domains of your application and give you an idea on how to organize your API. There are several approaches to start to design an application.

* Requirements driven (Use Cases)
* Outside In (UX Driven)
* Data driven (or inside out) 
* Technology driven (choose technology first)

All approaches can be right or wrong, you wont know until you dive in, but it is also helpful to start with thinking about defining the problem. Often as problem solvers we want to jump to solutions before we have taken time to describe and document the problem.

Lets start with a problem statement:

``` text
Title: The current movie review system is broken! 

Prior Art:

* Amazon Prime Reviews
* Rotten Tomatoes
* IMDb


Description (hypothesis):

if it was easy for everyone to review movies and everyone could react to those reviews, we could use the reviewers characteristic data and the reactions of the review to create an accurate and valuable review that provides relevant information to the user looking to watch a movie.

```

So lets take this problem statement and hypothesis and work on a solution, maybe we would start with a application map.

## User Types

* User (searches reviews, and reacts to reviews)
* Reviewer (writes reviews, and everything a user does)
* Admin (manages users)

## Features

* Create an Account
* Login
* Logout
* Search movies 
* View movie with list of reviews
* View movie review
* React to review
* Write a review

## User Stories

```
Feature: View movie with list of reviews

As a User
I want to view the movie Ghostbusters and view the list of reviews
So that I can determine if I want to watch the movie

Scenario: Successfully view movie and reviews

Given I search for the movie Ghostbusters
When I select Ghostbusters from the list of movie results
Then I should see the movie title Ghostbusters
And a list of reviews, showing the reviewer username, date and rating

API Calls:

GET /movies/1
GET /movies/1/reviews

```

### Exercise 1

Pick one feature and write a user story with at least one scenario using the user story structure above.

### Exercise 2

Write the API calls required to satisfy the `THEN` section of the scenario.


## OpenAPI Editor

In this workshop, we will use https://editor.swagger.io/ to build our API documentation.

``` yaml
openapi: 3.0.3
info:
  title: movie-reviewer
  description: >
    Build a movie review app
  contact:
    url: https://hyper.io/contact
    email: info@hyper.io
    name: hyper
  license:
    name: Apache Licnense 2.0
  version: "1.0"
servers:
  - description: Development Server
    url: http://localhost:3000
paths:
  /:
    get:
      description: Healthcheck
      responses:
        "200":
          description: success
          content:
            application/json:
              schema:
                properties:
                  name:
                    description: api name
                    type: string

```

Let's create an API path for the above endpoint `GET /movies/{id}`

``` yaml
/api/movies/{id}:
    get:
      tags: [movies]
      description: get movie by identifier
      parameters:
        - name: id
          in: path
          schema:
            type: string
          required: true
          
      responses:
        200:
          description: success
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/movie"
        404:
          description: not found
...
components:
  schemas:
    movie:
      required: [id, title, year, genre, actors]
      properties:
        id: 
          type: string
        title:
          type: string
        year:
          type: string
        actors:
          type: array
          items:
            type: string
        genre:
          type: string
          enum:
            - action
            - comedy
            - horror
            - scifi
            - drama
            - romance
```

## Sequence Diagrams

For complicated interactions or team discussions, it is good to draw sequence diagrams to have technology discussions on approaches for specific APIs

* https://www.websequencediagrams.com/

![Example](https://www.websequencediagrams.com/cgi-bin/cdraw?lz=dGl0bGUgVW4AAwVkCgpBbGljZS0-Qm9iOiBBdXRoZW50aWNhdGlvbiBSZXF1ZXN0Cm5vdGUgcmlnaHQgb2YgACUFQm9iIHRoaW5rcyBhYm91dCBpdApCb2ItPgBKBQA3E3Nwb25zZQo&s=default)

> Using a simple markup language, I can draw out a diagram that represents a clean view of the process of the required feature.

```
title Untitled

Alice->Bob: Authentication Request
note right of Bob: Bob thinks about it
Bob->Alice: Authentication Response
```

### Exercise

Use the web sequence diagram tool to document the api endpoint processes for your feature.

## Data Validation

Data validation is often over looked in API's, but it is an important requirement that can provide solid signals to developers trying to use your API. We will use a module called `zod`.

``` js
import * as z from 'zod'

const schema = z.object({

})

export default validateMovie(movie) {

}

```

Exercise:

Create a zod schema for one of the models used in your feature:
For documentation help on zod check out: https://github.com/colinhacks/zod


## Integration Tests

Integration tests are clearly the most powerful tests in your tool chain, because they test 
the connected business rules from api endpoint to a mocked backend.

## Securing the API

It is all about SCOPES and JWTs. A JWT is a signed token that contains data that you can trust, part of that data is 
the scopes property. These scopes describe the capabilities granted for this requestor against this API.

## README

The README file is the first file a developer consuming your API will check out, it also is valuable for developers that may wish to contribute to improve your API. All README files should be the landing point for developers looking for help and developers looking to contribute, it is important to properly separate these developer types and communicate appropriately to each.

### Exercise

* Take a moment and lookup an example of a well defined README from a developer consumer standpoint
* Take a moment and lookup an example of a well defined README from a developer contributor standpoint

### My current README Template

``` markdown
<h1 align="center">Project Title</h1>
<p align="center">Description</p>
<div align="center">Any badges</div>

---

## Table of contents

- [Getting Started](#getting-started)
- [Usage](#usage)
- [Documentation](#documentation)
- [Testing](#testing)
- [Code of Conduct](#code-of-conduct)
- [Contribution](#contribution)
- [License](#license)

---

```

## CI/CD

Continuous Integration and Continuous Delivery are two very important aspects of API design and development, my recommendation and practice is to have your integration strategy and delivery pipeline completed first, before you write too much code. Having these components to your development process will give you a fast feedback loop out of the gate. If you are not practicing CI/CD it is not too late to start.

### Trunk based development

### Automated deployment

### Resources

* Continuous Delivery Youtube channel
* Trunk based development website
* ...

### Discussion

* When you hear trunk based development, what fears prompt you to push back?
* Questions? How do you change from feature branch to trunk based?

## Frictionless Development (misc)

When onboarding team members to a project it can be a bit of a challenge to get them up to speed, often times I have seen new developers struggle to get the development environment configured for contribution, this starts a new team member on the wrong foot. Taking the time to create a frictionless onboarding process can keep integration loops short and ramping up new developers immediate, they are able to run dev environments on day one.

> Consider cloud-based development with tools like gitpod.io to create frictionless development experiences.

## Summary

Some takeaways:

1. separate your business logic from your services
   don't marry your business rules to services like databases that may affect the future of your application.
1. consider the strategy of design based on your problem statement, make sure you and your team fully understands the problem you are trying to solve
1. sketch simple mockups of your ux if it helps identify and separate features in your application
1. APIs should describe features or be capable to combine to create features
1. Don't worry about being to specific when designing APIs for the presentation layer, general API should be designed for business logic
1. Don't worry about getting it right on the first go, create artifacts that are easy to modify over time.