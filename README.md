# subxfinder

subxfinder is a search engine for subtitles from SubDivx.com. This allows you to search the subtitles without using the SubDivx crapy search form.

[![NPM](https://nodei.co/npm/subxfinder.png)](https://nodei.co/npm/subxfinder/)

## Import subxfinder

```
var subxfinder = require('subxfinder');
```

## Usage

### Search

You can make a basic search. Calling the "search" method you can browse the subtitles searching by the title.

```
subxfinder.search('seinfeld', function(err, response){
	if(!err){
		console.log(response);
	}else{
		console.log(err);
	}
});
```

### Search Filtering (By Description)

You can also make a basic search filtering by description. The searchAndFilter method have 3 parameters:

* Title
* Description
* Strict

The Strict paramater will determinate the type of search that is going to be made. If you put the value on true, you are going to make an strict search on the description.

If you enter 'yify x264' with strict = true, the filter is going to look for an exact match on the description like: "This is the subtitle for yify x274 movie". If the description is "This is the subtitle for x264 yify movie" is not going to match. Example:

```
subxfinder.searchAndFilter('mad max', 'yify x264', true, function(err, response){
    if(!err){
		console.log(response);
    }else{
    	console.log(err);
    }
});
```

If you want you want to make a search with strict = false, this will allow you to make a more flexible search:

```
subxfinder.searchAndFilter('mad max', 'yify 1080', false, function(err, response){
    if(!err){
		console.log(response);
    }else{
    	console.log(err);
    }
});
```

In this example, you are going to look for a subtitle that have "yify" and "1080" on the description.

## License
```
The MIT License (MIT)

Copyright (c) <2015> <Ariel Rey>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
