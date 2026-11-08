SHELL := /bin/bash
VERSION := $(shell cat VERSION)

.PHONY: all check desktop server clean release

all: check desktop

check:
	./scripts/check.sh

desktop:
	./build.sh desktop

server:
	./build.sh server

clean:
	-lb clean --purge
	rm -rf out

release:
	./scripts/release.sh
