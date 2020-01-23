# Unified
1. 23/01/2020
2. Syntax Trees
3. Syntax Trees
4. Syntax Trees
5. Syntax Trees
---

## Table of Contents


## Part 1

More thoughts on this topic later, but what a lovely diagram:

```
| ........................ process ........................... |
| .......... parse ... | ... run ... | ... stringify ..........|

          +--------+                     +----------+
Input ->- | Parser | ->- Syntax Tree ->- | Compiler | ->- Output
          +--------+          |          +----------+
                              X
                              |
                       +--------------+
                       | Transformers |
                       +--------------+

```