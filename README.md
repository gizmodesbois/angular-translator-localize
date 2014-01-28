# Angular Translator Localize

## Objectives

Giving the opportunity to translate your website with a dictionary based on your browser language

## Use

### Languages files

To use the translator, you need multiple languages files inside the language directory (You can change the directory name from the factory).

```
languages/dictionary-default.json
languages/dictionary-en.json
languages/dictionary-fr.json
```

In those files, you an add as many value for the dictionary as you want. To proceed, had it like in the follow example

```
[{
	"name": "header",
	"value": "Header title",
	"description": "Text for the header title"
}, {
	"name": "footer",
	"value": "Footer title",
	"description": "Text for the footer title"
}]
```

The description in only here to give informations for translation team and developer. You can remove them when you push it in production.

### Expression in template

To use the translate inside your template, use the name from the dictionary and use the filter translate to use it.

Example:

```
<h1>{{'header' | translate}}</h1>
```

## Saving state

The dictionary is automatically save on the user browser to avoid useless request between multiple pages.
If you want to update the dictionary on the user browser, you have to change the version of the dictionary (inside the factory).

## TO-DO

- Directives way
- Translation in real time
- Changing language on the fly
- Changing version on the fly