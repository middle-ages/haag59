# Geometry

Useful basic geometry for the terminal

## Table of Contents

1. [orientation](#orientation)
1. [dir](#dir)
1. [corner](#corner)
1. [borderDir](#borderDir)
1. [spacing](#spacing)
1. [align](#align)
1. [size](#size)
1. [pos](#pos)
1. [rect](#rect)

## Modules

### orientation

#### Types

|Name<img width="250" height="0">|Note|
|-|-|
|`Orientation`                |Horizontal or vertical orientation union|
|`Oriented<T>`                |Dictionary of `Orientation` => `T`|
|`Orient`                     |An `Oriented<string>`|
|`Orthogonal<O ⋤ Orientation>`|Map an orientation to its opposite|

#### Values

|Name<img width="250" height="0">|Note|
|-|-|
|`orientations`               |The two orientations `horizontal` and `vertical`|
|`vertical`                   |`Vertical` values array|
|`all`                        |`Dir` values array|
|`orthogonal`                 |Map an orientation to its opposite|
|`show`                       |`Show` instance|


### dir

#### Types

|Name<img width="250"  height="0"/>|Note|
|-|-|
|`Horizontal`          |Pair of horizontal directions|
|`Vertical`            |Pair of vertical directions|
|`HDir`                |Union of horizontal directions|
|`VDir`                |Union of vertical directions|
|`Dirs`                |List of all directions|
|`Dir`                 |Union of all directions|
|`OrientDir`           |Dictionary of `Orientation` => `Dir`|
|`Directed<T>`         |Dictionary of `Dir` => `T`|
|`Direct`              |Dictionary of `Dir` => `string|
|`ReversedDir<D ⋤ Dir>`|Map a direction to its opposite|

#### Values

|Name<img width="250" height="0"/>|Note|
|-|-|
|`hDirs`                      |`Horizontal` values array|
|`vDirs`                      |`Vertical` values array|
|`allDirs`                    |`Dir` values array|
|`orientDirs`                 |Return directions at an orientation|
|`pickDirs`                   |Filter all non-`Dir` keys from an object|
|`fromOriented`               |Convert and `Oriented` to a `Directed`|
|`hFlip`                      |Flip _left_ ↔ _right_ of a `Directed`|
|`vFlip`                      |Flip _top_ ↔ _bottom_ of a `Directed`|
|`flip`                       |`hFlip` • `vFlip`|
|`reversed`                   |Return the opposite `Dir` of a `Dir`|
|`singleton`                  |A `Directed<T>` of one value|
|`snug`                       |Return the snug `Dir` pair of a `Dir`|
|`mapDir`                     |Map over the four directions|
|`mapHDir`                    |Map over the horizontal direction pair|
|`mapVDir`                    |Map over the vertical direction pair|
|`zipDir`                     |Zip a 4-tuple with the four directions|
|`matchDir`                   |Select one of four by direction|
|`show`                       |`Show` instance|

### corner

#### Types

|Name<img width="250">|Note|
|-|-|
|`Corner`                     |A corner position on a rectangle|
|`Cornered<T>`                |Dictionary of `Corner` => `T`|
|`Corners`                    |A `Cornered<string>`|

#### Values

|Name<img width="250">|Note|
|-|-|
|`allCorners`                 |All corners: top left, top right, bottom left, bottom right|
|`checkCorner`                |`string` to corner type guard|
|`mapCorners`                 |Map over all corners|
|`zipCorners`                 |Zip a 4-tuple with the corners|
|`fromTuple`                  |Convert a 4-tuple into a `Cornered<T>`|
|`cornered`                   |Convert a string of 4 characters into a `Corners`|
|`cornerSingleton`            |Create a `Cornered<T>` of a single value|
|`show`                       |`Show` instance|

### borderDir

#### Types

|Name<img width="250">|Note|
|-|-|
|`BorderDir`                  |A border direction = direction or corner|
|`Bordered<T>`                |Dictionary of `Border` => `T`|

#### Values

|Name<img width="250">|Note|
|-|-|
|`mapBorderDir`               |Map over all border directions|
|`modAt`                      |Given a function over values of a `Bordered<T>` and a border dir, returns a function that copies a given `Bordered<D>` and returns it after applying the function to the value at the border dir|
|`borderDirSingleton`         |Create a `Bordered<T>` of a single value|
|`isHorizontalBorderDir`      |Type guard for `left`/`right`|
|`isVerticalBorderDir`        |Type guard for `top`/`bottom`|
|`isTopEdge`                  |Type guard for directions pointing up|
|`isBottomEdge`               |Type guard for directions pointing down|
|`isLeftEdge`                 |Type guard for directions pointing left|
|`isRightEdge`                |Type guard for directions pointing right|
|`snugBorderDirs`             |Given a border dir, returns its 3 snug border dirs|
|`snugCorners`                |Just the corners that hug a given border dir|
|`show`                       |`Show` instance|
|`Show` instance|

### spacing

#### Types

|Name<img width="250">|Note|
|-|-|
|`Spacing`                    |`Directed<number>` - A record of distance per direction|
|`HSpacing`                   |A record of horizontal direction to distance |
|`VSpacing`                   |A record of vertical direction to distance |

#### Values

|Name<img width="250">|Note|
|-|-|
|`square`                     |Build spacing from a single number|
|`rect`                       |Build spacing from a a pair of numbers|
|`tupled`                     |Build from a 4-tuple in clockwise direction|
|`fromTop`                    |Build from a top spacing, other directions will be empty |
|`fromRight`                  |Build from a right spacing, other directions will be empty |
|`fromBottom`                 |Build from a bottom spacing, other directions will be empty |
|`fromLeft`                   |Build from a left spacing, other directions will be empty |
|`zeroWidth`                  |Build a purely vertical spacing from a pair of numbers|
|`zeroHeight`                 |Build a purely horizontal spacing from a pair of numbers|
|`monoid`                     |`Monoid` instance for sum of `Spacing` at each direction`|
|`eq`                         |`Eq` instance|
|`show`                       |`Show` instance|

### align

#### Types

|Name<img width="250">|Note|
|-|-|
|`HAlign`                     |The type of horizontal alignments|
|`VAlign`                     |The type of vertical alignments|
|`OrientAlign`                |Either a horizontal or a vertical alignment|
|`Align`                      |A horizontal + vertical alignment|

#### Values

|Name<img width="250">|Note|
|-|-|
|`align`                      |Build from a binary argument list of horizontal and vertical alignments|
|`hAlign`                     |The vertical alignment list: `left`, `center`, `right`|
|`vAlign`                     |The vertical alignment list: `top`, `middle`, `bottom`|
|`isHorizontal`               |Type guard for horizontal alignments|
|`isVertical`                 |Type guard for vertical alignments|
|`horizontally`               |Compute horizontal alignment for a single item|
|`vertically`                 |Compute vertical alignment for a single item|
|`shrinkSpacing`              |Shrink spacing by the given size at the direction of the given alignment|
|`matchHAlign`                |Dispatch on horizontal alignment|
|`matchVAlign`                |Dispatch on vertical alignment|
|`mapHAlign`                  |Map over all horizontal alignments|
|`mapVAlign`                  |Map over all vertical alignments|
|`eq`                         |`Eq` instance|
|`ord`                        |`Ord` instance|
|`show`                       |`Show` instance|

### size

#### Types

|Name<img width="250">|Note|
|-|-|
|`Size`                       |Record of width and height|

#### Values

|Name<img width="250">|Note|
|-|-|
|`size`                       |Build a size using a binary argument list of width and height|
|`square`                     |Build a size where width=height|
|`area`                       |width * height|
|`hasArea`                    |Size with area=0|
|`isEmpty`                    |Size with width=0 and height=0|
|`width`                      |Lens on size width|
|`height`                     |Lens on size height|
|`fitsInside`                 |True if the the 1st size fits inside the 2nd|
|`add`                        |Add another size|
|`sub`                        |Subtract one size from the other|
|`inc`                        |Increment width and height by one|
|`dec`                        |width-- and height--|
|`addWidth`                   |Add to width|
|`addHeight`                  |Add to height|
|`subWidth`                   |Subtract from width|
|`subHeight`                  |Subtract from height|
|`scaleH`                     |Scale width by given ratio|
|`scaleV`                     |Scale height by given ratio|
|`scale`                      |Scale size preserving aspect ratio|
|`halfWidth`                  |Return a new size where width has been halved|
|`halfHeight`                 |Return a new size where height has been halved|
|`half`                       |Return a new size where width and height have been halved|
|`double`                     |Return a new size where width and height have been doubled|
|`clamped`                    |Clamp width and height to minimum and maximum values|
|`monoid.sum`                 |`Monoid` instance for adding sizes|
|`monoid.max`                 |`Monoid` instance for finding max size|
|`eq`                         |`Eq` instance|
|`ord.width`                  |`Ord` instance by width|
|`ord.height`                 |`Ord` instance by height|
|`show`                       |`Show` instance|

### pos

#### Types

|Name<img width="250">|Note|
|-|-|
|`Pos`                        |Record of distance to origin with keys `top` and `left`|

#### Values

|Name<img width="250">|Note|
|-|-|
|`pos`                        |Build a position  using a binary argument list of vertical (top) and horizontal (left) distances to origin|
|`fromTop`                    |Build a position on the Y axis at given distance from origin|
|`fromLeft`                   |Build a position on the X axis at given distance from origin|
|`top`                        |Lens on position top|
|`left`                       |Lens on position left|
|`isOrigin`                   |True if {0,0} |
|`sizeFromOrigin`             |Size of rectangle from origin to position|
|`bottomRight`                |Given a size what would be the bottom right position of a rectangle placed at this position?|
|`add`                        |Add two positions|
|`sub`                        |Subtract one position from another|
|`addSize`                    |Add width to left and height to top|
|`subSize`                    |Subtract width from left and height from top|
|`inc`                        |Increment top and left by one|
|`dec`                        |Shifts position one position to the left and one position up|
|`addTop`                     |Add to position `top`|
|`addLeft`                    |Add to position `left`|
|`monoid.sum`                 |`Monoid` instance for adding positions|
|`monoid.max`                 |`Monoid` instance for finding position furthest from origin|
|`eq`                         |`Eq` instance|
|`ord`                        |`Ord` instance by distance from origin|
|`show`                       |`Show` instance|

### rect

#### Types

|Name<img width="250">|Note|
|-|-|
|`Rect`                       |A rectangle with position, size, and z-order|

#### Values

|Name<img width="250">|Note|
|-|-|
|`rect`                       |Build a rectangle with default (0) zOrder using a binary argument list of position and size|
|`empty`                      |An empty rectangle at origin|
|`tupled`                     |Build a rectangle from a pair of position and size|
|`fromQuad`                   |Build from a pair of width + height and a pair of top + left|
|`fromTuple`                  |Build from a 4-tuple of top, left, width, height|
|`fromCorners`                |Build from the given top left and bottom right corner positions|
|`fromPos`                    |Build an empty rectangle at given position|
|`fromSize`                   |Build an a rectangle with the given size placed at {0,0}|
|`getCorners`                 |Get top left and bottom right positions of the rectangle|
|`toQuad`                     |Get the rectangle as a pair off pairs: width,height and top,left|
|`area`                       |Rectangle width * height|
|`add`                        |Returns the bounding rectangle of the given pair|
|`addPos`                     |Add the position to the rectangle position|
|`subPos`                     |Subtract the position to the rectangle position|
|`addSize`                    |Add the size to the rectangle size|
|`subSize`                    |Subtract the size to the rectangle size|
|`addTop`                     |Add to rectangle position `top`|
|`addLeft`                    |Add to rectangle position `left`|
|`subTop`                     |Subtract from rectangle position `top`|
|`subLeft`                    |Subtract from rectangle position `left`|
|`incSize`                    |Increment width and height by one|
|`decSize`                    |width-- and height--|
|`addWidth`                   |Add to rectangle width|
|`addHeight`                  |Add to rectangle height|
|`subWidth`                   |Subtract from rectangle width|
|`subHeight`                  |Subtract from rectangle height|
|`scaleH`                     |Scale width by given ratio|
|`scaleV`                     |Scale height by given ratio|
|`scale`                      |Scale size preserving aspect ratio|
|`halfWidth`                  |Return a new rectangle where width has been halved|
|`halfHeight`                 |Return a new rectangle where height has been halved|
|`size`                       |Lens on rectangle size|
|`pos`                        |Lens on rectangle position|
|`zOrder`                     |Lens on rectangle zOrder|
|`width`                      |Lens on rectangle width|
|`height`                     |Lens on rectangle height|
|`top`                        |Lens on rectangle top distance to x-axis|
|`left`                       |Lens on rectangle left distance to y-axis|
|`right`                      |Lens on rectangle right distance to x-axis|
|`bottom`                     |Lens on rectangle bottom distance to y-axis|
|`center`                     |Lens on rectangle center distance to x-axis|
|`middle`                     |Lens on rectangle middle distance to y-axis|
|`middleCenter`               |Lens on rectangle center position|
|`topLeft`                    |Lens on rectangle top left position|
|`topRight`                   |Lens on rectangle top right position|
|`bottomLeft`                 |Lens on rectangle bottom left position|
|`bottomRight`                |Lens on rectangle bottom right position|
|`incZOrder`                  |zOrder++|
|`decZOrder`                  |zOrder--|
|`unsetZOrder`                |Reset zOrder to default 0|
|`eqPos`                      |True if two rectangle are at the same position|
|`eqSize`                     |True if two rectangle are of the same size|
|`monoid`                     |`Monoid` instance for bounding boxes of rectangles|
|`eq`                         |`Eq` instance|
|`show`                       |`Show` instance|

## Project Development

See [workspace CONTRIBUTING](../../CONTRIBUTING.md) 