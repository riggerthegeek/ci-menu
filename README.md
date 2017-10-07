# ci-menu

Cross platform tray monitor for CI projects

# XML Format

> Taken from [Erik Doe's CCMenu repo](https://github.com/erikdoe/ccmenu/wiki/Multiple-Project-Summary-Reporting-Standard)

Summary information will be available as a plain XML string retrievable through an http GET request.

A single `<Projects>` node, the document root, which contains 0 or many `<Project>` nodes.

Each `<Project>` may have the following attributes:

| name            | description                                                                                                                         | type                                                          | required  |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | --------- |
| name            | the name of the project                                                                                                             | string                                                        | yes       |
| activity        | the current state of the project                                                                                                    | string enum : `Sleeping`, `Building`, `CheckingModifications` | yes       |
| lastBuildStatus | a brief description of the last build                                                                                               | string enum : `Success`, `Failure`, `Exception`, `Unknown`    | yes       |
| lastBuildLabel  | a referential name for the last build                                                                                               | string                                                        | no        |
| lastBuildTime   | when the last build occurred                                                                                                        | DateTime                                                      | yes       |
| nextBuildTime   | when the next build is scheduled to occur (or when the next check to see whether a build should be performed is scheduled to occur) | DateTime                                                      | no        |
| webUrl          | a URL for where more detail can be found about this project                                                                         | string (URL)                                                  | yes       |

Clients that consume this XML should not rely on any optional attribute being present, and should degrade their functionality gracefully.

## Example

```xml
<Projects>
    <Project
        name="SvnTest"
        activity="Sleeping"
        lastBuildStatus="Exception"
        lastBuildLabel="8"
        lastBuildTime="2005-09-28T10:30:34.6362160+01:00"
        nextBuildTime="2005-10-04T14:31:52.4509248+01:00"
        webUrl="http://mrtickle/ccnet/"/>

    <Project
        name="HelloWorld"
        activity="Sleeping"
        lastBuildStatus="Success"
        lastBuildLabel="13"
        lastBuildTime="2005-09-15T17:33:07.6447696+01:00"
        nextBuildTime="2005-10-04T14:31:51.7799600+01:00"
        webUrl="http://mrtickle/ccnet/"/>
</Projects>
```
