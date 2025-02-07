import React, { useState, useEffect } from "react";
import { Puck } from "@measured/puck";
import "@measured/puck/puck.css";

const ImageComponent = ({
  src,
  alt,
  width,
  height,
  className,
  fallbackSrc = "https://via.placeholder.com/300?text=Image+not+found",
  fit = "cover",
  position = "center",
  borderRadius = "8px",
  boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)",
  border = "none",
  cursor = "default",
  hoverEffect = "none",
  filter = "none",
  transition = "0.3s ease-in-out",
  backgroundColor = "transparent",
  ariaLabel,
  role = "img",
  title,
  aspectRatio,
  opacity = "1",
  visibility = "visible",
  display = "block",
  padding = "0",
  margin = "0",
  maxWidth = "100%",
  maxHeight,
  minWidth,
  minHeight,
  zIndex,
  positionType,
  top,
  right,
  bottom,
  left,
  shadowOnHover = "false",
  rotate = "0deg",
  flip, // "horizontal" or "vertical"
}) => {
  const [imgSrc, setImgSrc] = useState(src);

  const hoverStyles = {
    brightness: "brightness(1.2)",
    scale: "scale(1.1)",
    opacity: "opacity(0.8)",
    rotate: "rotate(5deg)",
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{
        maxWidth,
        maxHeight,
        minWidth,
        minHeight,
        aspectRatio,
        opacity,
        visibility,
        display,
        objectFit: fit,
        objectPosition: position,
        borderRadius,
        boxShadow,
        border,
        cursor,
        transition,
        filter,
        backgroundColor,
        padding,
        margin,
        zIndex,
        position: positionType,
        top,
        right,
        bottom,
        left,
        transform: `${rotate !== "0deg" ? `rotate(${rotate})` : ""} ${
          flip === "horizontal" ? "scaleX(-1)" : flip === "vertical" ? "scaleY(-1)" : ""
        }`,
      }}
      aria-label={ariaLabel}
      role={role}
      title={title}
        onError={(e) => {
        if (e.target.src !== fallbackSrc) {
          e.target.onerror = null;
          setImgSrc(fallbackSrc);
        }
      }}
      onMouseOver={(e) => {
        if (hoverEffect in hoverStyles) {
          e.target.style.transform = hoverStyles[hoverEffect];
        }
        if (shadowOnHover == "true") {
          e.target.style.boxShadow = "0px 10px 20px rgba(0,0,0,0.2)";
        }
      }}
      onMouseOut={(e) => {
        e.target.style.transform = "none";
        if (shadowOnHover == "true") {
          e.target.style.boxShadow = boxShadow;
        }
      }}
    />
  );
};



const config = {
  components: {
    ImageBlock: {
      fields: {
        src: { type: "text", label: "Image URL" },
        alt: { type: "text", label: "Alt Text" },
        width: { type: "text", label: "Width (e.g., '500px', '100%')" },
        height: { type: "text", label: "Height (e.g., '300px', 'auto')" },
        className: { type: "text", label: "CSS Class" },
        fallbackSrc: { type: "text", label: "Fallback Image URL" },
        fit: { type: "text", label: "Object Fit (cover, contain, fill, none, scale-down)" },
        position: { type: "text", label: "Object Position (e.g., 'top left')" },
        borderRadius: { type: "text", label: "Border Radius (e.g., '8px')" },
        boxShadow: { type: "text", label: "Box Shadow (e.g., '0px 4px 6px rgba(0, 0, 0, 0.1)')" },
        border: { type: "text", label: "Border Style (e.g., '1px solid #ccc')" },
        cursor: { type: "text", label: "Cursor Style (default, pointer, zoom-in, zoom-out)" },
        hoverEffect: { type: "text", label: "Hover Effect (brightness, scale, opacity, rotate)" },
        filter: { type: "text", label: "CSS Filter (e.g., 'grayscale(100%)')" },
        transition: { type: "text", label: "Transition (e.g., '0.3s ease-in-out')" },
        backgroundColor: { type: "text", label: "Background Color (e.g., '#f5f5f5')" },
        ariaLabel: { type: "text", label: "ARIA Label" },
        role: { type: "text", label: "ARIA Role (e.g., 'img')" },
        title: { type: "text", label: "Tooltip Text" },
        aspectRatio: { type: "text", label: "Aspect Ratio (e.g., '16/9')" },
        opacity: { type: "text", label: "Opacity (0-1)" },
        visibility: { type: "text", label: "Visibility (visible, hidden, collapse)" },
        display: { type: "text", label: "Display (block, inline-block, none)" },
        padding: { type: "text", label: "Padding (e.g., '10px')" },
        margin: { type: "text", label: "Margin (e.g., '0 auto')" },
        maxWidth: { type: "text", label: "Max Width (e.g., '100%')" },
        maxHeight: { type: "text", label: "Max Height (e.g., 'auto')" },
        minWidth: { type: "text", label: "Min Width (e.g., '100px')" },
        minHeight: { type: "text", label: "Min Height (e.g., '100px')" },
        zIndex: { type: "text", label: "Z-Index (e.g., '1')" },
        positionType: { type: "text", label: "Position (static, relative, absolute, fixed, sticky)" },
        top: { type: "text", label: "Top (e.g., '20px')" },
        right: { type: "text", label: "Right (e.g., '50px')" },
        bottom: { type: "text", label: "Bottom (e.g., '10px')" },
        left: { type: "text", label: "Left (e.g., '0px')" },
        rotate: { type: "text", label: "Rotate (e.g., '45deg')" },
        flip: { type: "text", label: "Flip (none, horizontal, vertical)" },
        shadowOnHover: { type: "text", label: "Shadow on Hover (true/false)" },
      },
      render: (props) => <ImageComponent {...props} />,
    },
    VideoBlock: {
      fields: {
        url: { type: "text", label: "Video URL" },
        title: { type: "text", label: "Video Title" },
        description: { type: "text", label: "Video Description" },
        thumbnail: { type: "text", label: "Thumbnail URL" },
        author: { type: "text", label: "Author Name" },
        category: { type: "text", label: "Category" },
        tags: { type: "text", label: "Tags (comma-separated)" },
        duration: { type: "text", label: "Duration (e.g., 3:45)" },
        publishedDate: { type: "text", label: "Published Date (YYYY-MM-DD)" },
        views: { type: "text", label: "View Count" },
        likes: { type: "text", label: "Likes Count" },
        resolution: { type: "text", label: "Resolution (e.g., 1080p)" },
        language: { type: "text", label: "Language" },
        platform: { type: "text", label: "Platform (YouTube, Vimeo, etc.)" },
    
        // Styling fields
        width: { type: "text", label: "Video Width (e.g., 560px, 100%)" },
        height: { type: "text", label: "Video Height (e.g., 315px)" },
        borderRadius: { type: "text", label: "Border Radius (e.g., 10px)" },
        boxShadow: { type: "text", label: "Box Shadow (e.g., 0px 4px 10px rgba(0,0,0,0.1))" },
        backgroundColor: { type: "text", label: "Background Color (e.g., #f5f5f5)" },
        textColor: { type: "text", label: "Text Color (e.g., #333)" },
        padding: { type: "text", label: "Padding (e.g., 10px 20px)" },
        margin: { type: "text", label: "Margin (e.g., 20px auto)" },
        textAlign: { type: "text", label: "Text Align (left, center, right)" },
        customClass: { type: "text", label: "Custom CSS Class" },
      },
      render: ({
        url,
        title,
        description,
        author,
        views,
        likes,
        publishedDate,
        width,
        height,
        borderRadius,
        boxShadow,
        backgroundColor,
        textColor,
        padding,
        margin,
        textAlign,
        customClass,
      }) =>
        url ? (
          <div
            className={customClass}
            style={{
              backgroundColor: backgroundColor,
              color: textColor,
              padding: padding,
              margin: margin,
              textAlign: textAlign,
              borderRadius: borderRadius,
              boxShadow: boxShadow,
            }}
          >
            <h3>{title}</h3>
            <p>By {author} | {views} views | Published on {publishedDate}</p>
            <iframe
              width={width || "560"}
              height={height || "315"}
              src={url}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Video Content"
              style={{ borderRadius }}
            ></iframe>
            <p>{description}</p>
            <p>👍 {likes}</p>
          </div>
        ) : (
          <p>No video available</p>
        ),
    },     
    Space: {
      fields: {
        size: { type: "text", label: "Size", defaultValue: "16px" },
        direction: {
          type: "radio",
          label: "Direction",
          options: [{label: "horizontal", value: "horizontal"}, {label: "vertical", value: "vertical"}],
          defaultValue: "vertical",
        },
      },
      render: ({ size = "16px", direction = "vertical" }) => {
        const style =
          direction === "vertical"
            ? { height: size, width: "100%" }
            : { width: size, height: "100%" };
        return <div style={style} />;
      },
    },
    Hero: {
      fields: {
        title: { type: "text", label: "Title" },
        subtitle: { type: "text", label: "Subtitle", defaultValue: "" }, // New field
        description: { type: "textarea", label: "Description" },
        padding: { type: "text", label: "Padding", defaultValue: "128px" },
        margin: { type: "text", label: "Margin", defaultValue: "0 auto" }, // New field
        align: { type: "text", label: "Alignment", defaultValue: "left" },
        backgroundColor: { type: "text", label: "Background Color", defaultValue: "white" },
        textColor: { type: "text", label: "Text Color", defaultValue: "black" },
        borderRadius: { type: "text", label: "Border Radius", defaultValue: "8px" }, // New field
        shadow: { type: "text", label: "Box Shadow", defaultValue: "none" }, // New field
        image: {
          type: "object",
          label: "Image",
          fields: {
            url: { type: "text", label: "Image URL" },
            mode: { type: "text", label: "Mode", defaultValue: "inline" },
            width: { type: "text", label: "Image Width", defaultValue: "100%" }, // New field
            height: { type: "text", label: "Image Height", defaultValue: "auto" }, // New field
            borderRadius: { type: "text", label: "Image Border Radius", defaultValue: "8px" }, // New field
          },
        },
        buttons: {
          type: "array",
          itemType: "object",
          label: "Buttons",
          fields: {
            label: { type: "text", label: "Label" },
            href: { type: "text", label: "Href" },
            variant: { type: "text", label: "Variant", defaultValue: "primary" },
            backgroundColor: { type: "text", label: "Button Background", defaultValue: "blue" }, // New field
            textColor: { type: "text", label: "Button Text Color", defaultValue: "white" }, // New field
            padding: { type: "text", label: "Button Padding", defaultValue: "10px 20px" }, // New field
            borderRadius: { type: "text", label: "Button Border Radius", defaultValue: "4px" }, // New field
          },
        },
      },
      render: ({
        title,
        subtitle,
        description,
        padding,
        margin,
        align,
        backgroundColor,
        textColor,
        borderRadius,
        shadow,
        image,
        buttons,
      }) => (
        <section
          style={{
            padding,
            margin,
            textAlign: align,
            backgroundColor,
            color: textColor,
            borderRadius,
            boxShadow: shadow,
          }}
        >
          <h1>{title}</h1>
          {subtitle && <h2 style={{ opacity: 0.8 }}>{subtitle}</h2>}
          <p>{description}</p>
          {image && image.url && (
            <img
              src={image.url}
              alt={title}
              style={{
                width: image.width,
                height: image.height,
                borderRadius: image.borderRadius,
                maxWidth: "100%",
              }}
            />
          )}
          <div>
            {buttons &&
              buttons.map((btn, index) => (
                <a
                  key={index}
                  href={btn.href}
                  style={{
                    margin: "0 5px",
                    padding: btn.padding,
                    background: btn.backgroundColor,
                    color: btn.textColor,
                    textDecoration: "none",
                    borderRadius: btn.borderRadius,
                  }}
                >
                  {btn.label}
                </a>
              ))}
          </div>
        </section>
      ),
    },    
    Logo: {
      fields: {
        src: { type: "text", label: "Logo Image URL" },
        alt: { type: "text", label: "Alt Text", defaultValue: "Company Logo" },
        width: { type: "text", label: "Width", defaultValue: "100px" },
        height: { type: "text", label: "Height", defaultValue: "auto" },
        href: { type: "text", label: "Link URL" },
        alignment: {
          type: "select",
          label: "Alignment",
          options: [{lable:"left", value:"left"}, {lable:"center", value:"center"}, {lable:"right", value:"right"}],
          defaultValue: "left"
        },
        margin: { type: "text", label: "Margin", defaultValue: "0" },
        padding: { type: "text", label: "Padding", defaultValue: "0" },
        backgroundColor: { type: "text", label: "Background Color" },
        borderRadius: { type: "text", label: "Border Radius", defaultValue: "0" },
        boxShadow: { type: "text", label: "Box Shadow" },
        fallbackSrc: { type: "text", label: "Fallback Image URL" },
      },
      render: ({
        src,
        alt,
        width,
        height,
        href,
        alignment,
        margin,
        padding,
        backgroundColor,
        borderRadius,
        boxShadow,
        fallbackSrc
      }) => {
        const imageSrc = src || fallbackSrc;
        const containerStyle = {
          textAlign: alignment,
          margin,
          padding,
          backgroundColor,
          boxShadow,
          display: "inline-block"
        };

        const imageStyle = {
          width,
          height,
          borderRadius,
          objectFit: "contain"
        };

        const content = imageSrc ? (
          <img src={imageSrc} alt={alt} style={imageStyle} />
        ) : (
          <div style={{ ...imageStyle, background: "#ddd", display: "flex", alignItems: "center", justifyContent: "center" }}>
            Logo
          </div>
        );

        return href ? (
          <a href={href} style={containerStyle}>
            {content}
          </a>
        ) : (
          <div style={containerStyle}>{content}</div>
        );
      }
    }, 
    HeadingBlock: {
      fields: {
        children: { type: "text", label: "Heading Text" },
        color: { type: "text", label: "Color", defaultValue: "black" },
        size: { type: "text", label: "Size", defaultValue: "2em" },
        fontWeight: {
          type: "select",
          label: "Font Weight",
          options: [
            { label: "Normal", value: "normal" },
            { label: "Bold", value: "bold" },
            { label: "Lighter", value: "lighter" },
            { label: "Bolder", value: "bolder" },
            { label: "100", value: "100" },
            { label: "200", value: "200" },
            { label: "300", value: "300" },
            { label: "400", value: "400" },
            { label: "500", value: "500" },
            { label: "600", value: "600" },
            { label: "700", value: "700" },
            { label: "800", value: "800" },
            { label: "900", value: "900" }
          ],
          defaultValue: "bold"
        },
        fontFamily: {
          type: "select",
          label: "Font Family",
          options: [
            { label: "Arial", value: "Arial, sans-serif" },
            { label: "Helvetica", value: "Helvetica, sans-serif" },
            { label: "Times New Roman", value: "'Times New Roman', serif" },
            { label: "Georgia", value: "Georgia, serif" },
            { label: "Courier New", value: "'Courier New', monospace" },
            { label: "Verdana", value: "Verdana, sans-serif" }
          ],
          defaultValue: "Arial, sans-serif"
        },
        textTransform: {
          type: "select",
          label: "Text Transform",
          options: [
            { label: "None", value: "none" },
            { label: "Capitalize", value: "capitalize" },
            { label: "Uppercase", value: "uppercase" },
            { label: "Lowercase", value: "lowercase" }
          ],
          defaultValue: "none"
        },
        textAlign: {
          type: "select",
          label: "Text Align",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
            { label: "Justify", value: "justify" }
          ],
          defaultValue: "left"
        },
        lineHeight: { type: "text", label: "Line Height", defaultValue: "1.2" },
        letterSpacing: { type: "text", label: "Letter Spacing", defaultValue: "normal" },
        padding: { type: "text", label: "Padding", defaultValue: "0" },
        margin: { type: "text", label: "Margin", defaultValue: "0 0 1rem 0" }
      },
      render: ({
        children = "Default Heading",
        color,
        size,
        fontWeight,
        fontFamily,
        textTransform,
        textAlign,
        lineHeight,
        letterSpacing,
        padding,
        margin
      }) => (
        <h1 style={{
          color,
          fontSize: size,
          fontWeight,
          fontFamily,
          textTransform,
          textAlign,
          lineHeight,
          letterSpacing,
          padding,
          margin
        }}>
          {children}
        </h1>
      ),
    },
    Text: {
      fields: {
        text: { type: "textarea", label: "Text" },
        align: {
          type: "select",
          label: "Alignment",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" },
            { label: "Justify", value: "justify" }
          ],
          defaultValue: "center"
        },
        color: { type: "text", label: "Text Color", defaultValue: "black" },
        backgroundColor: { type: "text", label: "Background Color", defaultValue: "transparent" },
        size: { type: "text", label: "Font Size", defaultValue: "16px" },
        fontFamily: {
          type: "select",
          label: "Font Family",
          options: [
            { label: "Arial", value: "Arial, sans-serif" },
            { label: "Helvetica", value: "Helvetica, sans-serif" },
            { label: "Times New Roman", value: "'Times New Roman', serif" },
            { label: "Georgia", value: "Georgia, serif" },
            { label: "Courier New", value: "'Courier New', monospace" },
            { label: "Verdana", value: "Verdana, sans-serif" }
          ],
          defaultValue: "Arial, sans-serif"
        },
        fontWeight: {
          type: "select",
          label: "Font Weight",
          options: [
            { label: "Normal", value: "normal" },
            { label: "Bold", value: "bold" },
            { label: "Lighter", value: "lighter" },
            { label: "Bolder", value: "bolder" },
            { label: "100", value: "100" },
            { label: "200", value: "200" },
            { label: "300", value: "300" },
            { label: "400", value: "400" },
            { label: "500", value: "500" },
            { label: "600", value: "600" },
            { label: "700", value: "700" },
            { label: "800", value: "800" },
            { label: "900", value: "900" }
          ],
          defaultValue: "normal"
        },
        textTransform: {
          type: "select",
          label: "Text Transform",
          options: [
            { label: "None", value: "none" },
            { label: "Capitalize", value: "capitalize" },
            { label: "Uppercase", value: "uppercase" },
            { label: "Lowercase", value: "lowercase" }
          ],
          defaultValue: "none"
        },
        letterSpacing: { type: "text", label: "Letter Spacing", defaultValue: "normal" },
        lineHeight: { type: "text", label: "Line Height", defaultValue: "1.5" },
        textDecoration: {
          type: "select",
          label: "Text Decoration",
          options: [
            { label: "None", value: "none" },
            { label: "Underline", value: "underline" },
            { label: "Overline", value: "overline" },
            { label: "Line-through", value: "line-through" }
          ],
          defaultValue: "none"
        },
        padding: { type: "text", label: "Padding", defaultValue: "0" },
        margin: { type: "text", label: "Margin", defaultValue: "0 0 1rem 0" },
        width: { type: "text", label: "Width", defaultValue: "auto" }
      },
      render: ({
        text,
        align,
        color,
        backgroundColor,
        size,
        fontFamily,
        fontWeight,
        textTransform,
        letterSpacing,
        lineHeight,
        textDecoration,
        padding,
        margin,
        width
      }) => (
        <p style={{
          textAlign: align,
          color,
          backgroundColor,
          fontSize: size,
          fontFamily,
          fontWeight,
          textTransform,
          letterSpacing,
          lineHeight,
          textDecoration,
          padding,
          margin,
          width
        }}>
          {text}
        </p>
      ),
    },
    Button: {
      fields: {
        label: { type: "text", label: "Button Label" },
        href: { type: "text", label: "Link URL" },
        variant: {
          type: "select",
          label: "Variant",
          options: [
            { label: "Primary", value: "primary" },
            { label: "Secondary", value: "secondary" },
            { label: "Danger", value: "danger" },
            { label: "Success", value: "success" }
          ],
          defaultValue: "primary"
        },
        backgroundColor: { type: "text", label: "Background Color", defaultValue: "blue" },
        textColor: { type: "text", label: "Text Color", defaultValue: "white" },
        fontSize: { type: "text", label: "Font Size", defaultValue: "16px" },
        fontWeight: {
          type: "select",
          label: "Font Weight",
          options: [
            { label: "Normal", value: "normal" },
            { label: "Bold", value: "bold" },
            { label: "Lighter", value: "lighter" },
            { label: "Bolder", value: "bolder" }
          ],
          defaultValue: "bold"
        },
        borderRadius: { type: "text", label: "Border Radius", defaultValue: "4px" },
        border: { type: "text", label: "Border", defaultValue: "none" },
        padding: { type: "text", label: "Padding", defaultValue: "10px 20px" },
        margin: { type: "text", label: "Margin", defaultValue: "0" },
        width: { type: "text", label: "Width", defaultValue: "auto" },
        cursor: {
          type: "select",
          label: "Cursor",
          options: [
            { label: "Default", value: "default" },
            { label: "Pointer", value: "pointer" },
            { label: "Not Allowed", value: "not-allowed" }
          ],
          defaultValue: "pointer"
        },
        hoverBackgroundColor: { type: "text", label: "Hover Background Color", defaultValue: "darkblue" },
        hoverTextColor: { type: "text", label: "Hover Text Color", defaultValue: "white" }
      },
      render: ({
        label,
        href,
        variant,
        backgroundColor,
        textColor,
        fontSize,
        fontWeight,
        borderRadius,
        border,
        padding,
        margin,
        width,
        cursor,
        hoverBackgroundColor,
        hoverTextColor
      }) => {
        const style = {
          display: "inline-block",
          padding,
          backgroundColor: variant === "primary" ? backgroundColor : variant === "secondary" ? "gray" : variant === "danger" ? "red" : "green",
          color: textColor,
          fontSize,
          fontWeight,
          textDecoration: "none",
          borderRadius,
          border,
          margin,
          width,
          cursor,
          transition: "background 0.3s, color 0.3s"
        };

        return (
          <a href={href} style={style}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = hoverBackgroundColor;
              e.target.style.color = hoverTextColor;
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = style.backgroundColor;
              e.target.style.color = style.color;
            }}>
            {label}
          </a>
        );
      },
    },
    Card: {
      fields: {
        title: { type: "text", label: "Title" },
        description: { type: "textarea", label: "Description" },
        icon: { type: "text", label: "Icon (URL)" },
        image: { type: "text", label: "Background Image (URL)" },
        imagePosition: {
          type: "select",
          label: "Image Position",
          options: [
            { label: "Top", value: "top" },
            { label: "Left", value: "left" },
            { label: "Right", value: "right" },
            { label: "Background", value: "background" }
          ],
          defaultValue: "top"
        },
        backgroundColor: { type: "text", label: "Background Color", defaultValue: "#fff" },
        textColor: { type: "text", label: "Text Color", defaultValue: "#000" },
        padding: { type: "text", label: "Padding", defaultValue: "16px" },
        margin: { type: "text", label: "Margin", defaultValue: "16px 0" },
        borderRadius: { type: "text", label: "Border Radius", defaultValue: "8px" },
        border: { type: "text", label: "Border", defaultValue: "1px solid #ccc" },
        boxShadow: { type: "text", label: "Box Shadow", defaultValue: "none" },
        width: { type: "text", label: "Width", defaultValue: "auto" },
        height: { type: "text", label: "Height", defaultValue: "auto" },
        align: {
          type: "select",
          label: "Text Alignment",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" }
          ],
          defaultValue: "left"
        },
        fontSize: { type: "text", label: "Font Size", defaultValue: "16px" },
        fontWeight: {
          type: "select",
          label: "Font Weight",
          options: [
            { label: "Normal", value: "normal" },
            { label: "Bold", value: "bold" },
            { label: "Lighter", value: "lighter" },
            { label: "Bolder", value: "bolder" }
          ],
          defaultValue: "bold"
        },
        buttonLabel: { type: "text", label: "Button Label", defaultValue: "" },
        buttonLink: { type: "text", label: "Button Link", defaultValue: "#" },
        buttonVariant: {
          type: "select",
          label: "Button Variant",
          options: [
            { label: "Primary", value: "primary" },
            { label: "Secondary", value: "secondary" },
            { label: "Danger", value: "danger" }
          ],
          defaultValue: "primary"
        },
        hoverEffect: {
          type: "select",
          label: "Hover Effect",
          options: [
            { label: "None", value: "none" },
            { label: "Shadow", value: "shadow" },
            { label: "Lift", value: "lift" },
            { label: "Scale", value: "scale" }
          ],
          defaultValue: "none"
        },
        hoverTransform: { type: "text", label: "Custom Hover Transform", defaultValue: "" }
      },
      render: ({
        title,
        description,
        icon,
        image,
        imagePosition,
        backgroundColor,
        textColor,
        padding,
        margin,
        borderRadius,
        border,
        boxShadow,
        width,
        height,
        align,
        fontSize,
        fontWeight,
        buttonLabel,
        buttonLink,
        buttonVariant,
        hoverEffect,
        hoverTransform
      }) => {
        const hoverStyles = {
          ...(hoverEffect === "shadow" && { boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }),
          ...(hoverEffect === "lift" && { transform: "translateY(-4px)" }),
          ...(hoverEffect === "scale" && { transform: "scale(1.05)" }),
          ...(hoverTransform && { transform: hoverTransform })
        };

        const cardStyle = {
          display: "flex",
          flexDirection: imagePosition === "left" || imagePosition === "right" ? "row" : "column",
          alignItems: align === "center" ? "center" : "flex-start",
          justifyContent: "space-between",
          backgroundColor,
          color: textColor,
          padding,
          margin,
          borderRadius,
          border,
          boxShadow,
          width,
          height,
          textAlign: align,
          overflow: "hidden",
          transition: "all 0.3s ease",
        };

        return (
          <div style={cardStyle} onMouseOver={(e) => Object.assign(e.currentTarget.style, hoverStyles)} onMouseOut={(e) => Object.assign(e.currentTarget.style, cardStyle)}>
            {image && imagePosition !== "background" && (
              <img src={image} alt="Card image" style={{
                width: imagePosition === "left" || imagePosition === "right" ? "40%" : "100%",
                height: imagePosition === "top" ? "auto" : "100%",
                objectFit: "cover",
                borderTopLeftRadius: borderRadius,
                borderTopRightRadius: borderRadius
              }} />
            )}
            <div style={{ padding: "16px" }}>
              {icon && <img src={icon} alt="Card icon" style={{ width: "40px", marginBottom: "1rem" }} />}
              <h3 style={{ fontSize, fontWeight }}>{title}</h3>
              <p>{description}</p>
              {buttonLabel && (
                <a href={buttonLink} style={{
                  display: "inline-block",
                  padding: "10px 20px",
                  backgroundColor: buttonVariant === "primary" ? "blue" : buttonVariant === "secondary" ? "gray" : "red",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "4px",
                  marginTop: "10px"
                }}>
                  {buttonLabel}
                </a>
              )}
            </div>
          </div>
        );
      },
    },
    ProductBlock: {
      fields: {
        name: { type: "text", label: "Product Name" },
        description: { type: "textarea", label: "Description" },
        price: { type: "number", label: "Price", defaultValue: 0 },
        originalPrice: { type: "number", label: "Original Price", defaultValue: 0 },
        discount: { type: "number", label: "Discount (%)", defaultValue: 0 },
        currency: { type: "text", label: "Currency", defaultValue: "$" },
        stockStatus: {
          type: "select",
          label: "Stock Status",
          options: [
            { label: "In Stock", value: "in-stock" },
            { label: "Out of Stock", value: "out-of-stock" },
            { label: "Limited Stock", value: "limited" }
          ],
          defaultValue: "in-stock"
        },
        rating: { type: "number", label: "Rating (1-5)", defaultValue: 5, min: 1, max: 5 },
        imageUrl: { type: "text", label: "Image URL" },
        imagePosition: {
          type: "select",
          label: "Image Position",
          options: [
            { label: "Top", value: "top" },
            { label: "Left", value: "left" },
            { label: "Right", value: "right" }
          ],
          defaultValue: "top"
        },
        buttonLabel: { type: "text", label: "Button Label", defaultValue: "Buy Now" },
        buttonLink: { type: "text", label: "Button Link", defaultValue: "#" },
        buttonVariant: {
          type: "select",
          label: "Button Variant",
          options: [
            { label: "Primary", value: "primary" },
            { label: "Secondary", value: "secondary" },
            { label: "Danger", value: "danger" }
          ],
          defaultValue: "primary"
        },
        backgroundColor: { type: "text", label: "Background Color", defaultValue: "#fff" },
        textColor: { type: "text", label: "Text Color", defaultValue: "#000" },
        padding: { type: "text", label: "Padding", defaultValue: "16px" },
        margin: { type: "text", label: "Margin", defaultValue: "16px 0" },
        borderRadius: { type: "text", label: "Border Radius", defaultValue: "8px" },
        boxShadow: { type: "text", label: "Box Shadow", defaultValue: "none" },
        textAlign: {
          type: "select",
          label: "Text Alignment",
          options: [
            { label: "Left", value: "left" },
            { label: "Center", value: "center" },
            { label: "Right", value: "right" }
          ],
          defaultValue: "left"
        },
        hoverEffect: {
          type: "select",
          label: "Hover Effect",
          options: [
            { label: "None", value: "none" },
            { label: "Shadow", value: "shadow" },
            { label: "Lift", value: "lift" },
            { label: "Scale", value: "scale" }
          ],
          defaultValue: "none"
        }
      },
      render: ({
        name,
        description,
        price,
        originalPrice,
        discount,
        currency,
        stockStatus,
        rating,
        imageUrl,
        imagePosition,
        buttonLabel,
        buttonLink,
        buttonVariant,
        backgroundColor,
        textColor,
        padding,
        margin,
        borderRadius,
        boxShadow,
        textAlign,
        hoverEffect
      }) => {
        const hoverStyles = {
          ...(hoverEffect === "shadow" && { boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }),
          ...(hoverEffect === "lift" && { transform: "translateY(-4px)" }),
          ...(hoverEffect === "scale" && { transform: "scale(1.05)" }),
        };

        const productStyle = {
          display: "flex",
          flexDirection: imagePosition === "left" || imagePosition === "right" ? "row" : "column",
          alignItems: textAlign === "center" ? "center" : "flex-start",
          backgroundColor,
          color: textColor,
          padding,
          margin,
          borderRadius,
          boxShadow,
          textAlign,
          transition: "all 0.3s ease",
        };

        return (
          <div style={productStyle} onMouseOver={(e) => Object.assign(e.currentTarget.style, hoverStyles)} onMouseOut={(e) => Object.assign(e.currentTarget.style, productStyle)}>
            {imageUrl && (
              <img src={imageUrl} alt={name} style={{
                width: imagePosition === "left" || imagePosition === "right" ? "40%" : "100%",
                height: imagePosition === "top" ? "auto" : "100%",
                objectFit: "cover",
                borderRadius
              }} />
            )}
            <div style={{ padding: "16px" }}>
              <h2>{name || "Unnamed Product"}</h2>
              <p>{description || "No description available."}</p>
              {originalPrice > 0 && discount > 0 ? (
                <p style={{ textDecoration: "line-through", opacity: 0.7 }}>
                  {currency}{originalPrice.toFixed(2)}
                </p>
              ) : null}
              <p style={{ fontSize: "1.2em", fontWeight: "bold" }}>
                {currency}{(price || 0).toFixed(2)}
              </p>
              {stockStatus === "out-of-stock" ? (
                <p style={{ color: "red", fontWeight: "bold" }}>Out of Stock</p>
              ) : stockStatus === "limited" ? (
                <p style={{ color: "orange", fontWeight: "bold" }}>Limited Stock</p>
              ) : (
                <p style={{ color: "green", fontWeight: "bold" }}>In Stock</p>
              )}
              {rating > 0 && (
                <p>{"⭐".repeat(Math.round(rating))}</p>
              )}
              {buttonLabel && (
                <a href={buttonLink} style={{
                  display: "inline-block",
                  padding: "10px 20px",
                  backgroundColor: buttonVariant === "primary" ? "blue" : buttonVariant === "secondary" ? "gray" : "red",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "4px",
                  marginTop: "10px"
                }}>
                  {buttonLabel}
                </a>
              )}
            </div>
          </div>
        );
      },
    },
    Table: {
      fields: {
        headers: {
          type: "array",
          itemType: "text",
          label: "Table Headers",
          defaultValue: [],
        },
        rows: {
          type: "array",
          itemType: "array",
          label: "Table Rows",
          defaultValue: [],
        },
      },
      render: ({ headers, rows }) => (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {headers?.map((header, index) => (
                <th key={index} style={{ borderBottom: "2px solid black", padding: "8px" }}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows?.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row?.map((cell, cellIndex) => (
                  <td key={cellIndex} style={{ borderBottom: "1px solid #ccc", padding: "8px" }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ),
    },
    Avatar: {
      fields: {
        imageUrl: { type: "text", label: "Image URL" },
        alt: { type: "text", label: "Alt Text", defaultValue: "User Avatar" },
        size: { type: "text", label: "Size", defaultValue: "50px" },
        borderColor: { type: "text", label: "Border Color", defaultValue: "transparent" },
        borderWidth: { type: "text", label: "Border Width", defaultValue: "0px" },
        shadow: { type: "text", label: "Box Shadow", defaultValue: "none" },
        backgroundColor: { type: "text", label: "Background Color", defaultValue: "transparent" },
      },
      render: ({ imageUrl, alt, size, shape, borderColor, borderWidth, shadow, backgroundColor, fallbackText }) => (
        imageUrl ? (
          <img
            src={imageUrl}
            alt={alt}
            style={{
              width: size,
              height: size,
              borderRadius: shape === "circle" ? "50%" : "0%",
              objectFit: "cover",
              border: `${borderWidth} solid ${borderColor}`,
              boxShadow: shadow,
              backgroundColor,
            }}
          />
        ) : (
          <div
            style={{
              width: size,
              height: size,
              borderRadius: shape === "circle" ? "50%" : "0%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "calc(" + size + " / 2.5)",
              fontWeight: "bold",
              color: borderColor,
              backgroundColor,
              border: `${borderWidth} solid ${borderColor}`,
              boxShadow: shadow,
            }}
          >
            {fallbackText}
          </div>
        )
      ),
    },     
  },
};


export function Editor() {
  const defaultData = {
    blocks: [],
    content: [],
    root: { props: {} },
    zones: {},
  };

  const [editorData, setEditorData] = useState(() => {
    const savedData = localStorage.getItem("editorData");
    return savedData ? JSON.parse(savedData) : defaultData;
  });

  const [previewMode, setPreviewMode] = useState(false);


  const handlePublish = (data) => {
    console.log("Data saved:", data);
    setEditorData(data);
    localStorage.setItem("editorData", JSON.stringify(data));
  };


  const handleChange = (data) => {
    console.log("Editor data changed:", data);
  };


  const handleShare = () => {
    if (editorData) {
      const dataStr = JSON.stringify(editorData, null, 2);
      navigator.clipboard
        .writeText(dataStr)
        .then(() => alert("Editor data copied to clipboard!"))
        .catch((err) => alert("Failed to copy data: " + err));
    } else {
      alert("No editor data to share!");
    }
  };


  const handleReset = () => {
    if (window.confirm("Are you sure you want to clear the editor data?")) {
      localStorage.removeItem("editorData");
      setEditorData(defaultData);
    }
  };


  const handleExport = () => {
    const dataStr = JSON.stringify(editorData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "puck-data.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setPreviewMode(!previewMode)}>
          {previewMode ? "Switch to Edit Mode" : "Switch to Preview Mode"}
        </button>
        <button onClick={handleShare} style={{ marginLeft: "10px" }}>
          Share Data
        </button>
        <button onClick={handleReset} style={{ marginLeft: "10px" }}>
          Reset Data
        </button>
        <button onClick={handleExport} style={{ marginLeft: "10px" }}>
          Export JSON
        </button>
      </div>
      {previewMode ? (
        <div>
          <h2>Preview Mode</h2>
          <Puck config={config} data={editorData} readOnly={true} />
        </div>
      ) : (
        <Puck
          config={config}
          data={editorData}
          onPublish={handlePublish}
          onChange={handleChange}
        />
      )}
    </div>
  );
}
